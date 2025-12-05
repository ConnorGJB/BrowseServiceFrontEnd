import { inject, ref, type Ref } from 'vue';
import { CATALOGUE_ITEMS_KEY, type CatalogueItems } from '../config/appServices';
import type { CatalogueItem } from '../app/catalogue-service';
import type { AddCatalogueItemCommand } from '../app/add-catalogueItem';

export type UseCatalogueItems = {
  // state
  readonly catalogueItems: Ref<readonly CatalogueItem[]>;
  readonly totalCount: Ref<number>;
  readonly loading: Ref<boolean>;
  readonly adding: Ref<boolean>;
  readonly error: Ref<string | null>;
  // actions
  fetchCatalogueItems: () => Promise<void>;
  addCatalogueItem: (command: AddCatalogueItemCommand) => Promise<void>;
};

export function useCatalogueItems(): UseCatalogueItems {
  const uses = inject<CatalogueItems>(CATALOGUE_ITEMS_KEY);
  if (!uses) throw new Error('CatalogueItems not provided');

  const catalogueItems = ref<readonly CatalogueItem[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const adding = ref(false);
  const error = ref<string | null>(null);

  const fetchCatalogueItems = async (): Promise<void> => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const result = await uses.listCatalogueItems();
      if (result.success) {
        catalogueItems.value = result.catalogueItems;
        totalCount.value = result.totalCount;
      } else {
        error.value = result.errors.join('; ');
        catalogueItems.value = [];
        totalCount.value = 0;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
      catalogueItems.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const add = async (command: AddCatalogueItemCommand): Promise<void> => {
    if (adding.value) return;
    adding.value = true;
    error.value = null;
    try {
      const result = await uses.addCatalogueItem(command);
      if (result.success) {
        // Prepend the new item for a "newest first" UI; keep immutable array for safety
        catalogueItems.value = [result.catalogueItem, ...catalogueItems.value];
        totalCount.value = Math.max(totalCount.value + 1, catalogueItems.value.length);
      } else {
        error.value = result.errors.join('; ');
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      adding.value = false;
    }
  };

  return {
    catalogueItems,
    totalCount,
    loading,
    adding,
    error,
    fetchCatalogueItems,
    addCatalogueItem: add,
  };
}
