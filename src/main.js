import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { setToken } from './api/api'; // importe la fonction setToken

// Si un token est stocké (ex : après un login)
const savedToken = localStorage.getItem('auth_token');
if (savedToken) {
  setToken(savedToken); // le réinjecte dans Axios
}

createApp(App)
  .use(router)
  .mount('#app');