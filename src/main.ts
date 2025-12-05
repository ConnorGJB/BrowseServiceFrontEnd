import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { buildCatalogueItemUses, CATALOGUE_ITEMS_KEY } from './config/appServices';

const app = createApp(App);

app.use(router);

// Provide bound catalogue use cases to the app's DI container
app.provide(CATALOGUE_ITEMS_KEY, buildCatalogueItemUses());

app.mount('#app');
