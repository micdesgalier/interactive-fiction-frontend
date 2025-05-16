// src/router/index.js

// Importation des fonctions nécessaires depuis Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Importation des vues utilisées dans les routes
import StoriesView from '../views/StoriesView.vue';
import ChapterView from '../views/ChapterView.vue';

// Définition des routes de l'application
const routes = [
  {
    // Route principale affichant la liste des histoires
    path: '/stories',
    name: 'Stories',
    component: StoriesView
  },
  {
    // Route dynamique pour afficher un chapitre spécifique d'une histoire
    // :sid est l'identifiant de l'histoire
    // :cid? est l'ordre du chapitre, optionnel (le "?" signifie qu'il n'est pas obligatoire)
    path: '/stories/:sid/:cid?',
    name: 'Chapter',
    component: ChapterView,
    props: true  // Les paramètres de route (sid, cid) sont passés en tant que props au composant
  },
  {
    // Route de secours : toute URL non reconnue redirige vers /stories
    path: '/:pathMatch(.*)*',
    redirect: '/stories'
  }
];

// Création de l'instance de routeur avec l'historique HTML5
const router = createRouter({
  history: createWebHistory(), // Utilise des URLs propres (sans #)
  routes                        // Liste des routes définies ci-dessus
});

// Export du routeur pour pouvoir l'utiliser dans main.js
export default router;