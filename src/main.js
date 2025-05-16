// src/main.js

// Import de la fonction de création d'application Vue
import { createApp } from 'vue';

// Import du composant racine de l'application
import App from './App.vue';

// Import du routeur pour la navigation SPA
import router from './router';

// Import de la fonction utilitaire pour configurer le token d’authentification
import { setToken } from './api/api';

// 1) Gestion du token stocké au chargement de l’application
//    Si l’utilisateur s’est déjà authentifié et que son token est en localStorage,
//    on le réinjecte dans Axios pour que toutes les requêtes ultérieures soient authentifiées.
const savedToken = localStorage.getItem('auth_token');
if (savedToken) {
  setToken(savedToken);
}

// 2) Création de l’instance Vue et configuration du routeur
createApp(App)
  .use(router)
  .mount('#app');
