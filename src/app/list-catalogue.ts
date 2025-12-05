import type { CatalogueService, CatalogueItem } from './catalogue-service';

/**
 * Use case: List catalogue items.
 *
 * Contract
 * - Input: a CatalogueService instance (injected)
 * - Output: ListCatalogueItemsResult
 * - Errors: Caught exceptions are converted to a result with errors and empty items
 */
export type ListCatalogueItemsResult =
  | { success: true; catalogueItems: readonly CatalogueItem[]; totalCount: number }
  | { success: false; errors: readonly string[] };

export type ListCatalogueItemsUseCase = (
  service: CatalogueService,
) => Promise<ListCatalogueItemsResult>;

/**
 * Lists catalogue items using the provided CatalogueService.
 *
 * Normalizes the response so callers can safely iterate over `catalogueItems`
 * without null checks (defaults to []).
 */
export const listCatalogueItems: ListCatalogueItemsUseCase = async (service) => {
  try {
    const { catalogueItems, totalCount } = await service.listCatalogueItems();
    return { success: true, catalogueItems, totalCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
