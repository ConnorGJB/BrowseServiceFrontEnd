import type { CatalogueService } from '../app/catalogue-service';
import { listCatalogueItems } from '../app/list-catalogue';
import type { ListCatalogueItemsResult } from '../app/list-catalogue';
import { addCatalogueItem } from '../app/add-catalogueItem';
import type { AddCatalogueItemCommand, AddCatalogueItemResult } from '../app/add-catalogueItem';
import { FakeCatalogueService } from '../infra/fake-catalogue-service';
import { HttpCatalogueService } from '../infra/http-catalogue-service';

// Lazy singleton for the app's CatalogueService implementation.
let _catalogueService: CatalogueService | undefined;

// Resolve which implementation to use based on env.
// - VITE_CATALOGUE_SERVICE: 'fake' | 'http' (optional)
// - VITE_CATALOGUE_BASE_URL: string (optional)
// - VITE_USE_SEED_DATA: 'true' | 'false' (optional, defaults to false)
function createCatalogueServiceFromEnv(): CatalogueService {
  const env = import.meta.env as Record<string, string | undefined>;
  const kind = (env.VITE_CATALOGUE_SERVICE || '').toLowerCase();
  const baseUrl = env.VITE_CATALOGUE_BASE_URL;
  const useSeedData = env.VITE_USE_SEED_DATA === 'true';

  if (kind === 'fake') {
    return new FakeCatalogueService(useSeedData ? [] : []);
  }
  if (kind === 'http') return new HttpCatalogueService({ baseUrl });

  // Auto-detect: if a base URL is provided, prefer HTTP; otherwise use fake.
  if (baseUrl) return new HttpCatalogueService({ baseUrl });
  return new FakeCatalogueService([]);
}

export function getCatalogueService(): CatalogueService {
  if (!_catalogueService) {
    _catalogueService = createCatalogueServiceFromEnv();
  }
  return _catalogueService;
}

// Optional: allow overriding in tests or specialized bootstraps
export function setCatalogueService(service: CatalogueService): void {
  _catalogueService = service;
}

// Factories that return use case functions bound to the resolved service
export function makeListCatalogueItems(): () => Promise<ListCatalogueItemsResult> {
  const service = getCatalogueService();
  return () => listCatalogueItems(service);
}

export function makeAddCatalogueItem(): (
  command: AddCatalogueItemCommand,
) => Promise<AddCatalogueItemResult> {
  const service = getCatalogueService();
  return (command: AddCatalogueItemCommand) => addCatalogueItem(service, command);
}

// Public contract returned by buildCatalogueItemUses
export type CatalogueItems = {
  listCatalogueItems: () => Promise<ListCatalogueItemsResult>;
  addCatalogueItem: (command: AddCatalogueItemCommand) => Promise<AddCatalogueItemResult>;
};

// Compound factory returning both bound use case functions
export function buildCatalogueItemUses(): CatalogueItems {
  return {
    listCatalogueItems: makeListCatalogueItems(),
    addCatalogueItem: makeAddCatalogueItem(),
  };
}

// Centralized DI key used by provider and composable
export const CATALOGUE_ITEMS_KEY = 'CatalogueItems' as const;
