<!-- src/App.vue -->
<script setup>
// Aucun script nécessaire ici : le routeur gère le rendu des vues.
</script>

<template>
  <!-- La vue correspondante au chemin actuel est injectée ici -->
  <router-view />
</template>

<style scoped>
/* Styles pour les logos (exemple Vite + Vue dans le boilerplate) */
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
/* Styles globaux (déplacer de préférence dans src/assets/global.css) */
body,
html {
  background-color: #2d3748;  /* gris foncé pour le fond */
  color: #edf2f7;             /* texte clair pour le contraste */
  margin: 0;
  min-height: 100vh;
  font-family: sans-serif;
}
</style>