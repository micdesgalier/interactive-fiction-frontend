<template>
  <!-- Composant de notification d’erreur affiché si la variable `error` est remplie -->
  <ErrorToast :modelValue="error" />

  <div class="stories-container">
    <!-- Titre principal de la page -->
    <h1 class="page-title">Liste des histoires disponibles</h1>

    <!-- Liste des histoires, chacune rendue dans une carte -->
    <ul class="stories-list">
      <li v-for="s in stories" :key="s.id">
        <h3 class="story-title">{{ s.title }}</h3>
        <p class="story-description">{{ s.description }}</p>

        <!-- Actions possibles pour chaque histoire -->
        <div class="story-actions">

          <!-- Si l'utilisateur a déjà commencé cette histoire -->
          <button
            v-if="hasProgress(s.id)"
            class="btn-reprendre"
            @click="goToChapter(s.id, progressFor(s.id))"
          >
            <span class="btn-icon">▶️</span> Reprendre au chapitre {{ progressFor(s.id) }}
          </button>

          <!-- Option pour recommencer depuis le début -->
          <button
            v-if="hasProgress(s.id)"
            class="btn-restart"
            @click="restartStory(s.id)"
          >
            <span class="btn-icon">🔄</span> Recommencer
          </button>

          <!-- Si aucune progression sauvegardée, proposer de commencer -->
          <button
            v-else
            class="btn-start"
            @click="goToChapter(s.id, 1)"
          >
            <span class="btn-icon">▶️</span> Commencer
          </button>

        </div>
      </li>
    </ul>

    <!-- Message affiché quand aucune histoire n’est disponible -->
    <p v-if="stories.length === 0" class="no-stories">
      Aucune histoire disponible pour le moment.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStories } from '../api/api'
import ErrorToast from '../components/ErrorToast.vue'

// Références réactives
const stories = ref([])     // Liste des histoires
const error = ref(null)     // Erreur à afficher (via ErrorToast)
const router = useRouter()

// Chargement des histoires à la montée du composant
onMounted(async () => {
  try {
    const { data } = await getStories()
    stories.value = data.data
  } catch (err) {
    // Si une erreur survient, on la passe au composant ErrorToast
    error.value = typeof err === 'object' && err.message
      ? err
      : { message: 'Erreur inattendue' }
  }
})

// Redirige vers un chapitre donné d'une histoire
function goToChapter(storyId, chapterOrder) {
  localStorage.setItem(`progress_story_${storyId}`, chapterOrder)
  router.push({ name: 'Chapter', params: { sid: storyId, cid: chapterOrder } })
}

// Réinitialise la progression de l'utilisateur et redémarre l'histoire
function restartStory(storyId) {
  localStorage.removeItem(`progress_story_${storyId}`)
  goToChapter(storyId, 1)
}

// Vérifie si une progression est sauvegardée en local
function hasProgress(storyId) {
  return localStorage.getItem(`progress_story_${storyId}`) !== null
}

// Récupère l’ordre du chapitre sauvegardé en local
function progressFor(storyId) {
  return Number(localStorage.getItem(`progress_story_${storyId}`))
}
</script>

<style scoped>
.page-title {
  text-align: center;
  margin-top: 2rem;
  font-size: 2rem;
  color: #edf2f7;
}

/* Grille responsive pour les cartes d'histoires */
.stories-list {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
  gap: 1.5rem !important;
  padding: 0 !important;
  list-style-type: none !important;
  margin: 2rem auto !important;
  max-width: 1200px !important;
}

.stories-list li {
  background-color: white !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  padding: 1.5rem !important;
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.story-title, .story-description {
  text-align: center !important;
}

.story-title {
  margin-bottom: 0.75rem !important;
  font-weight: bold !important;
  font-size: 1.5rem !important;
  color: #2d3748 !important;
}

.story-description {
  color: #666 !important;
  margin-bottom: 1.5rem !important;
  flex-grow: 1 !important;
}

/* Boutons d'action */
.btn-start, .btn-reprendre, .btn-restart {
  width: 100% !important;
  padding: 0.75rem 1.25rem !important;
  border-radius: 8px !important;
  margin-bottom: 0.75rem !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  border: none !important;
}

.btn-start {
  background-color: #5661f0 !important;
  color: white !important;
}

.btn-start:hover {
  background-color: #4853d0 !important;
  transform: translateY(-2px) !important;
}

.btn-reprendre {
  background-color: #ff7e5f !important;
  color: white !important;
}

.btn-reprendre:hover {
  background-color: #ff6a48 !important;
  transform: translateY(-2px) !important;
}

.btn-restart {
  background-color: #e0e0e0 !important;
  color: #333333 !important;
}

.btn-restart:hover {
  background-color: #cccccc !important;
  transform: translateY(-2px) !important;
}

/* Message en cas d'absence d'histoires */
.no-stories {
  text-align: center !important;
  padding: 3rem 0 !important;
  background-color: white !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
  margin: 2rem auto !important;
  max-width: 800px !important;
}

/* Adaptation responsive */
@media (max-width: 768px) {
  .stories-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
  }
}

@media (max-width: 480px) {
  .stories-list {
    grid-template-columns: 1fr !important;
  }
}
</style>