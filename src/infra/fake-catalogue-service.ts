import type {
  CatalogueItem,
  CatalogueService,
  AddCatalogueItemInput,
  AddCataloogueItemOutput,
  ListCatalogueItemsOutput,
} from '../app/catalogue-service';

/**
 * A simple in-memory implementation of CatalogueService for development/testing.
 */
export class FakeCatalogueService implements CatalogueService {
  private items: CatalogueItem[];
  private idCounter: number;

  constructor(initial: ReadonlyArray<CatalogueItem> = []) {
    this.items = [...initial];
    this.idCounter = initial.length;
  }

  async listCatalogueItems(): Promise<ListCatalogueItemsOutput> {
    // Return a shallow copy to avoid external mutation
    return {
      catalogueItems: [...this.items],
      totalCount: this.items.length,
    };
  }

  async addCatalogueItem(input: AddCatalogueItemInput): Promise<AddCataloogueItemOutput> {
    const item: CatalogueItem = {
      id: this.nextId(),
      name: input.name,
      category: input.category,
      totalQuantity: input.totalQuantity,
      reservedQuantity: 0,
      rating: 0,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Newest first
    this.items.unshift(item);
    return { catalogueItem: item };
  }

  private nextId(): string {
    this.idCounter += 1;
    return `ci_${this.idCounter}`;
  }
}
