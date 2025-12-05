import type { CatalogueService, AddCatalogueItemInput, CatalogueItem } from './catalogue-service';

/**
 * Use case: Add a catalogue item.
 *
 * Contract
 * - Input: a CatalogueService instance (injected) and AddCatalogueItemCommand
 * - Output: AddCatalogueItemResult
 * - Errors: Caught exceptions are converted to a result with errors
 */
export type AddCatalogueItemResult =
  | { success: true; catalogueItem: CatalogueItem }
  | { success: false; errors: readonly string[] };

// Command used by the application layer (decoupled from service DTOs)
export type AddCatalogueItemCommand = {
  readonly name: string;
  readonly category: string;
  readonly totalQuantity: number;
  readonly metadata?: Record<string, unknown>;
};

export type AddCatalogueItemUseCase = (
  service: CatalogueService,
  command: AddCatalogueItemCommand,
) => Promise<AddCatalogueItemResult>;

/**
 * Adds a catalogue item using the provided CatalogueService.
 *
 * Maps the command to service input, keeping layers decoupled.
 */
export const addCatalogueItem: AddCatalogueItemUseCase = async (service, command) => {
  try {
    // Map command -> service input explicitly, keeping layers decoupled
    const input: AddCatalogueItemInput = {
      name: command.name,
      category: command.category,
      totalQuantity: command.totalQuantity,
      metadata: command.metadata,
    };
    const { catalogueItem } = await service.addCatalogueItem(input);
    return { success: true, catalogueItem };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, errors: [message] };
  }
};
