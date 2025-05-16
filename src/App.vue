<script setup>
</script>

<template>
    <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
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
/* dans src/assets/global.css ou App.vue non scoped */
body, html {
  background-color: #2d3748;
  color: #edf2f7;
  min-height: 100vh;
  margin: 0;
}
</style>