<template>
  <div>
    <h1>API Stateless – Chapitres de l’histoire #1</h1>

    <!-- SECTION LOGIN -->
    <div v-if="!isAuthenticated">
      <h2>Se connecter</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="credentials.email" type="email" placeholder="Email" required />
        <input v-model="credentials.password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Login</button>
      </form>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </div>

    <!-- SECTION PRINCIPALE -->
    <div v-else>
      <button @click="loadChapters">Charger les chapitres</button>
      <button @click="handleLogout">Se déconnecter</button>

      <!-- Formulaire d’ajout -->
      <form @submit.prevent="handleCreateChapter">
        <div>
          <label for="title">Titre</label>
          <input id="title" v-model="newChapter.title" required />
        </div>
        <div>
          <label for="content">Contenu</label>
          <textarea id="content" v-model="newChapter.content" required></textarea>
        </div>
        <div>
          <label for="order">Ordre</label>
          <input id="order" type="number" v-model.number="newChapter.order" min="1" required />
        </div>
        <button type="submit">Ajouter un chapitre</button>
      </form>

      <ul v-if="chapters.length">
        <li v-for="c in chapters" :key="c.id">{{ c.title }} (ordre: {{ c.order }})</li>
      </ul>
      <p v-else>Aucun chapitre pour le moment.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { login, logout, getChapters, createChapter, setToken } from '../api/api';

const chapters        = ref([]);
// Inclure story_id dans la donnée pour la validation
const newChapter      = ref({ story_id: 1, title: '', content: '', order: 1 });
const credentials     = ref({ email: '', password: '' });
const loginError      = ref('');
const isAuthenticated = ref(false);

// Restaurer l'état auth si token présent
onMounted(() => {
  const savedToken = localStorage.getItem('auth_token');
  if (savedToken) {
    setToken(savedToken);
    isAuthenticated.value = true;
    loadChapters();
  }
});

// Charger les chapitres
async function loadChapters() {
  try {
    const res = await getChapters(1);
    chapters.value = res.data.data;
  } catch (err) {
    console.error('Erreur chargement chapitres:', err);
  }
}

// Créer un chapitre
async function handleCreateChapter() {
  try {
    // Inclure story_id dans la payload
    await createChapter(1, {
      story_id: newChapter.value.story_id,
      title: newChapter.value.title,
      content: newChapter.value.content,
      order: newChapter.value.order,
    });
    // Préparer le next order
    newChapter.value = {
      story_id: 1,
      title: '',
      content: '',
      order: chapters.value.length + 1
    };
    await loadChapters();
  } catch (err) {
    if (err.response?.status === 422) {
      console.error('Validation errors:', err.response.data.errors);
      alert(JSON.stringify(err.response.data.errors, null, 2));
    } else {
      console.error('Erreur création chapitre:', err);
    }
  }
}

// Connexion
async function handleLogin() {
  loginError.value = '';
  try {
    const data = await login(credentials.value);
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    isAuthenticated.value = true;
    await loadChapters();
  } catch (err) {
    loginError.value = err.response?.data?.message || 'Échec du login';
  }
}

// Déconnexion
function handleLogout() {
  logout();
  localStorage.removeItem('auth_token');
  isAuthenticated.value = false;
  chapters.value = [];
}
</script>

<style scoped>
.error { color: red; }
</style>