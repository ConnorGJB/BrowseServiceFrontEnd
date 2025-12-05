import { createRouter, createWebHistory } from 'vue-router';
import ListCatalogue from '@/views/ListCatalogue.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListCatalogue,
    },
  ],
});

export default router;
