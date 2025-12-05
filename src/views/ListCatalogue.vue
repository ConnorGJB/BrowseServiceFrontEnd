<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCatalogueItems } from '@/composables/use-catalogueItems';
import CatalogueItemCard from '@/components/CatalogueItemCard.vue';
import AddCatalogueItemForm from '@/components/AddCatalogueItemForm.vue';
import type { AddCatalogueItemCommand } from '@/app/add-catalogueItem';

const {
  catalogueItems,
  totalCount,
  loading,
  adding,
  error,
  fetchCatalogueItems,
  addCatalogueItem,
} = useCatalogueItems();

const showForm = ref(false);
const formRef = ref<InstanceType<typeof AddCatalogueItemForm> | null>(null);
const successMessage = ref<string | null>(null);

const handleToggleForm = () => {
  showForm.value = !showForm.value;
  successMessage.value = null;
  if (!showForm.value && formRef.value) {
    formRef.value.resetForm();
  }
};

const handleSubmit = async (command: AddCatalogueItemCommand) => {
  successMessage.value = null;
  await addCatalogueItem(command);

  if (!error.value) {
    successMessage.value = 'Item added successfully!';
    showForm.value = false;
    if (formRef.value) {
      formRef.value.resetForm();
    }
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
};

const handleCancel = () => {
  showForm.value = false;
  successMessage.value = null;
  if (formRef.value) {
    formRef.value.resetForm();
  }
};

onMounted(() => {
  fetchCatalogueItems();
});
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Catalogue Items</h1>
      <button @click="handleToggleForm" class="btn btn--add" :disabled="loading">
        {{ showForm ? 'Cancel' : '+ Add Item' }}
      </button>
    </header>

    <div v-if="!loading" class="page__meta" aria-live="polite">
      <span v-if="totalCount > 0">{{ totalCount }} total</span>
      <span v-else>None yet</span>
    </div>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

    <AddCatalogueItemForm
      v-if="showForm"
      ref="formRef"
      :is-submitting="adding"
      :error="error"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>
    <div v-else>
      <ul v-if="catalogueItems.length" class="grid" role="list">
        <li v-for="it in catalogueItems" :key="it.id" class="grid__item">
          <CatalogueItemCard :item="it" />
        </li>
      </ul>
      <p v-else class="state">No items yet. Add the first catalogue item.</p>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.page__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.page__meta {
  color: #6b7280; /* gray-500 */
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--add {
  background-color: #3b82f6;
  color: white;
}

.btn--add:hover:not(:disabled) {
  background-color: #2563eb;
}

.success-message {
  padding: 1rem;
  background-color: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 6px;
  color: #065f46;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
.grid__item {
  display: block;
}
.state {
  color: #374151; /* gray-700 */
}
.state--error {
  color: #b91c1c; /* red-700 */
}
</style>
