import type {
  CatalogueItem,
  CatalogueService,
  AddCatalogueItemInput,
  AddCataloogueItemOutput,
  ListCatalogueItemsOutput,
} from '../app/catalogue-service';

type CatalogueItemDto = {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  reservedQuantity: number;
  rating: number;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

type ListCatalogueItemsResponseDto =
  | { catalogueItems?: CatalogueItemDto[]; totalCount?: number; errors?: string[] }
  | CatalogueItemDto[];

type AddCatalogueItemResponseDto = { catalogueItem?: CatalogueItemDto; errors?: string[] };

export type HttpClient = typeof fetch;

export type HttpCatalogueServiceOptions = {
  readonly baseUrl?: string;
  readonly http?: HttpClient;
  readonly headers?: Record<string, string>;
};

export class HttpCatalogueService implements CatalogueService {
  private readonly baseUrl?: string;
  private readonly http: HttpClient;
  private readonly headers: Record<string, string>;

  constructor(options: HttpCatalogueServiceOptions = {}) {
    this.baseUrl = options.baseUrl
      ? options.baseUrl.replace(/\/$/, '')
      : undefined;
    // Ensure fetch is properly bound to a global target to avoid illegal invocation errors
    const rawHttp: HttpClient | undefined =
      options.http ?? (typeof fetch !== 'undefined' ? fetch : undefined);
    if (!rawHttp) {
      throw new Error('No fetch implementation available');
    }
    const target: any = typeof window !== 'undefined' ? window : globalThis;
    this.http = (rawHttp as any).bind(target);
    this.headers = { ...(options.headers ?? {}) };
  }

  async listCatalogueItems(): Promise<ListCatalogueItemsOutput> {
    const res = await this.http(this.url('/catalogue-items'), {
      method: 'GET',
      headers: this.mergeHeaders({ Accept: 'application/json' }),
    });
    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as ListCatalogueItemsResponseDto;

    const errors = Array.isArray(body)
      ? undefined
      : Array.isArray(body.errors)
        ? body.errors
        : undefined;
    if (errors && errors.length) throw new Error(errors.join('; '));

    const items = Array.isArray(body)
      ? body
      : Array.isArray(body.catalogueItems)
        ? body.catalogueItems
        : [];
    const mapped = items.map(toDomainCatalogueItem);
    const totalCount = Array.isArray(body)
      ? mapped.length
      : typeof body.totalCount === 'number'
        ? body.totalCount
        : mapped.length;
    return { catalogueItems: mapped, totalCount };
  }

  async addCatalogueItem(input: AddCatalogueItemInput): Promise<AddCataloogueItemOutput> {
    const dto = toAddCatalogueItemRequestDto(input);
    const res = await this.http(this.url('/catalogue-items'), {
      method: 'POST',
      headers: this.mergeHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(dto),
    });
    await this.ensureOk(res);
    const body = (await this.parseJson(res)) as AddCatalogueItemResponseDto;
    if (Array.isArray(body.errors) && body.errors.length) {
      throw new Error(body.errors.join('; '));
    }
    const itemDto = body.catalogueItem;
    if (!itemDto || typeof itemDto !== 'object') {
      throw new Error('Malformed add catalogue item response');
    }
    const item = toDomainCatalogueItem(itemDto);
    return { catalogueItem: item };
  }

  // helpers
  private url(path: string): string {
    if (!this.baseUrl) return path;
    return `${this.baseUrl}${path}`;
  }

  private mergeHeaders(extra: Record<string, string>): Record<string, string> {
    return { ...this.headers, ...extra };
  }

  private async ensureOk(res: Response): Promise<void> {
    if (res.ok) return;
    let message = `${res.status} ${res.statusText}`;
    try {
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const errBody = await res.clone().json();
        const msg = (errBody && (errBody.message || errBody.error)) as
          | string
          | undefined;
        if (msg) message = `${message} - ${msg}`;
      } else {
        const text = await res.clone().text();
        if (text) message = `${message} - ${text.slice(0, 300)}`;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  private async parseJson(res: Response): Promise<unknown> {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Invalid JSON response');
    }
  }
}

// Infra-level request DTO (decoupled from app AddCatalogueItemInput)
type AddCatalogueItemRequestDto = {
  name: string;
  category: string;
  totalQuantity: number;
  metadata?: Record<string, unknown>;
};

function toAddCatalogueItemRequestDto(input: AddCatalogueItemInput): AddCatalogueItemRequestDto {
  return {
    name: input.name,
    category: input.category,
    totalQuantity: input.totalQuantity,
    metadata: input.metadata,
  };
}

function toDomainCatalogueItem(dto: CatalogueItemDto): CatalogueItem {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    totalQuantity: dto.totalQuantity,
    reservedQuantity: dto.reservedQuantity,
    rating: dto.rating,
    status: dto.status,
    metadata: dto.metadata,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
