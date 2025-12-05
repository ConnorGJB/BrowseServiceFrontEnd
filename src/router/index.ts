import { createRouter, createWebHistory } from 'vue-router';
import ListCatalogueItem from '@/views/ListCatalogueItem.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListCatalogueItem,
    },
  ],
});

export default router;
