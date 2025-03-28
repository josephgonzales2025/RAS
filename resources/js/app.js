import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa las rutas

const app = createApp(App);
app.use(router); // Usa Vue Router
app.mount('#app');

