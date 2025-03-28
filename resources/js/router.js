import { createRouter, createWebHistory } from 'vue-router';
import Clients from '@/components/Clients.vue';
import Suppliers from '@/components/Suppliers.vue';
import Dispatches from '@/components/Dispatches.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Clients // Puedes cambiarlo por el componente que quieras como página principal
  },
  { path: '/clients', component: Clients },
  { path: '/suppliers', component: Suppliers },
  { path: '/dispatches', component: Dispatches }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
