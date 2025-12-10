export type CatalogueItem = {
  readonly id: string;
  readonly name: string;
  readonly rating?: number;
  readonly category: string;
  readonly totalQuantity: number;
  readonly reservedQuantity?: number;
  readonly status?: string;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export type ListCatalogueItemsOutput = {
  readonly catalogueItems: readonly CatalogueItem[];
  readonly totalCount: number;
};

export type AddCatalogueItemInput = {
  readonly name: string;
  readonly category: string;
  readonly totalQuantity: number;
  readonly metadata?: Record<string, unknown>;
};

export type AddCataloogueItemOutput = {
  readonly catalogueItem: CatalogueItem;
};

export interface CatalogueService {
  listCatalogueItems(): Promise<ListCatalogueItemsOutput>;
  addCatalogueItem(
    input: AddCatalogueItemInput,
  ): Promise<AddCataloogueItemOutput>;
}
