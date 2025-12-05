<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { AddCatalogueItemCommand } from '../app/add-catalogueItem';

const emit = defineEmits<{
  submit: [command: AddCatalogueItemCommand];
  cancel: [];
}>();

const props = defineProps<{
  isSubmitting?: boolean;
  error?: string | null;
}>();

const form = reactive({
  name: '',
  category: '',
  totalQuantity: 1,
  metadata: undefined as Record<string, unknown> | undefined,
});

const validationErrors = ref<Record<string, string>>({});
const touched = reactive({
  name: false,
  category: false,
  totalQuantity: false,
});

const validate = (): boolean => {
  const errors: Record<string, string> = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  } else if (name.length > 200) {
    errors.name = 'Name must be no more than 200 characters';
  }

  const category = form.category.trim();
  if (!category) {
    errors.category = 'Category is required';
  } else if (category.length < 2) {
    errors.category = 'Category must be at least 2 characters';
  } else if (category.length > 100) {
    errors.category = 'Category must be no more than 100 characters';
  }

  if (form.totalQuantity < 1) {
    errors.totalQuantity = 'Total quantity must be at least 1';
  } else if (!Number.isInteger(form.totalQuantity)) {
    errors.totalQuantity = 'Total quantity must be a whole number';
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const isValid = computed(() => {
  return (
    form.name.trim().length >= 3 &&
    form.name.trim().length <= 200 &&
    form.category.trim().length >= 2 &&
    form.category.trim().length <= 100 &&
    form.totalQuantity >= 1 &&
    Number.isInteger(form.totalQuantity)
  );
});

const handleSubmit = () => {
  touched.name = true;
  touched.category = true;
  touched.totalQuantity = true;

  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    category: form.category.trim(),
    totalQuantity: form.totalQuantity,
    metadata: form.metadata,
  });
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.name = '';
  form.category = '';
  form.totalQuantity = 1;
  form.metadata = undefined;
  validationErrors.value = {};
  touched.name = false;
  touched.category = false;
  touched.totalQuantity = false;
};

const markTouched = (field: keyof typeof touched) => {
  touched[field] = true;
  validate();
};

defineExpose({ resetForm });
</script>

<template>
  <div class="add-catalogue-item-form">
    <h2>Add Catalogue Item</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          v-model="form.name"
          @blur="markTouched('name')"
          placeholder="Item name"
          maxlength="200"
          :disabled="isSubmitting"
        />
        <span class="char-count">{{ form.name.length }} / 200</span>
        <span v-if="touched.name && validationErrors.name" class="error">
          {{ validationErrors.name }}
        </span>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <input
          id="category"
          type="text"
          v-model="form.category"
          @blur="markTouched('category')"
          placeholder="Item category"
          maxlength="100"
          :disabled="isSubmitting"
        />
        <span class="char-count">{{ form.category.length }} / 100</span>
        <span v-if="touched.category && validationErrors.category" class="error">
          {{ validationErrors.category }}
        </span>
      </div>

      <!-- Total Quantity -->
      <div class="form-group">
        <label for="totalQuantity">Total Quantity</label>
        <input
          id="totalQuantity"
          type="number"
          v-model.number="form.totalQuantity"
          @blur="markTouched('totalQuantity')"
          placeholder="1"
          min="1"
          :disabled="isSubmitting"
        />
        <span v-if="touched.totalQuantity && validationErrors.totalQuantity" class="error">
          {{ validationErrors.totalQuantity }}
        </span>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isValid || isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Add Item' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-catalogue-item-form {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.add-catalogue-item-form h2 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input[type='text'],
input[type='number'] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

input[type='text']:focus,
input[type='number']:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input[type='text']:disabled,
input[type='number']:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.char-count {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
}

.error {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}

.form-error {
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

@media (max-width: 640px) {
  .add-catalogue-item-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
