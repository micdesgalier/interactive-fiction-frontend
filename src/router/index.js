// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import ChaptersView from '../views/ChaptersView.vue'; // Assure-toi que le chemin vers le composant est correct
import StoriesView from '../views/StoriesView.vue';
import ChapterView from '../views/ChapterView.vue';

const routes = [
  {
    path: '/testchapters',
    name: 'TestChapters',
    component: ChaptersView, // Composant à afficher pour cette route
  },
  {
    path: '/stories',
    name: 'Stories',
    component: StoriesView
  },
  {
    path: '/stories/:sid/:cid?',
    name: 'Chapter',
    component: ChapterView,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/stories'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;