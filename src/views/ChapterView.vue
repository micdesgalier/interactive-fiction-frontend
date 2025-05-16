<template>
  <div class="chapter-view">
    <!-- Composant toast d’erreur réutilisable -->
    <ErrorToast :modelValue="error" />

    <!-- Bouton retour vers la liste des histoires -->
    <button class="btn-back" @click="goBack">← Retour aux histoires</button>

    <div class="chapter-container">
      <!-- Titre du chapitre, visible uniquement si le chapitre est chargé -->
      <h2 v-if="chapter" class="chapter-title">{{ chapter.title }}</h2>

      <!-- Contenu du chapitre + liste des choix -->
      <div v-if="chapter && chapter.choices.length">
        <!-- Texte du chapitre -->
        <div class="chapter-content">{{ chapter.content }}</div>

        <!-- Liste des choix disponibles pour ce chapitre -->
        <ul class="choices-list">
          <li v-for="choice in chapter.choices" :key="choice.id">
            <button @click="selectChoice(choice.target_chapter_id)">
              {{ choice.text }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Affichage spécial pour les chapitres de fin (aucun choix) -->
      <div v-else-if="chapter" class="epilogue">
        <div class="epilogue-header">
          🏁 <strong>FIN</strong>
        </div>

        <!-- Contenu du dernier chapitre (épilogue) -->
        <div class="chapter-content">{{ chapter.content }}</div>

        <!-- Proposer de recommencer l’histoire -->
        <button class="btn-restart" @click="restartStory">
          🔄 Recommencer l'histoire
        </button>
      </div>

      <!-- Affichage pendant le chargement du chapitre -->
      <p v-else class="loading">Chargement du chapitre…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getChapter, getChapterByOrder } from '../api/api';
import ErrorToast from '../components/ErrorToast.vue';

// Objets routeurs pour accéder aux paramètres d’URL et naviguer
const route = useRoute();
const router = useRouter();

// Références réactives
const chapter = ref(null);        // Données du chapitre courant
const error = ref(null);          // Message d’erreur (affiché par le toast)
const sid = route.params.sid;     // ID de l’histoire (récupéré depuis l’URL)
const cid = ref(Number(route.params.cid));  // Ordre du chapitre actuel

/**
 * Charge le chapitre par son ordre (cid)
 * Met à jour la progression dans le localStorage
 */
async function loadChapter(order) {
  chapter.value = null;
  error.value = null;
  try {
    const { data } = await getChapterByOrder(sid, order);
    chapter.value = data.data;

    // Sauvegarde la progression dans le localStorage
    localStorage.setItem(`progress_story_${sid}`, order);
  } catch (e) {
    error.value = { message: 'Impossible de charger le chapitre.' };
    // Redirige vers la liste des histoires après un délai
    setTimeout(() => router.push({ name: 'Stories' }), 2000);
  }
}

// Au montage du composant, charge le chapitre initial
onMounted(() => loadChapter(cid.value));

// Surveille les changements de cid dans l'URL (clic sur un choix)
watch(() => route.params.cid, newCid => loadChapter(Number(newCid)));

/**
 * Gère le clic sur un choix (bouton)
 * Va chercher les infos du chapitre ciblé et redirige
 */
async function selectChoice(nextChapterId) {
  if (!nextChapterId) return;

  error.value = null;
  try {
    const { data } = await getChapter(sid, nextChapterId);
    const nextOrder = data.data.order;

    // Redirige vers le chapitre suivant par son ordre
    router.push({ name: 'Chapter', params: { sid, cid: nextOrder } });
  } catch {
    error.value = { message: 'Chapitre suivant introuvable.' };
  }
}

// Retour vers la liste des histoires
function goBack() {
  router.push({ name: 'Stories' });
}

// Recommence l’histoire depuis le début
function restartStory() {
  localStorage.removeItem(`progress_story_${sid}`);
  router.push({ name: 'Chapter', params: { sid, cid: 1 } });
}
</script>

<style scoped>
.chapter-view { 
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.chapter-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-back {
  background: none;
  border: none;
  color: #5661f0;
  margin-bottom: 1rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.btn-back:hover {
  color: #4853d0;
  transform: translateX(-5px);
}

.chapter-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;
  font-weight: bold;
}

.chapter-content {
  margin-bottom: 2rem;
  line-height: 1.8;
  font-size: 1.25rem;
  color: #333;
  padding: 0.5rem;
}

.choices-list {
  list-style: none;
  padding: 0;
}
.choices-list li {
  margin-bottom: 1rem;
}
.choices-list button {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #5661f0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.choices-list button:hover {
  background-color: #4853d0;
  transform: translateY(-2px);
}

.epilogue {
  text-align: center;
  margin-top: 1rem;
}
.epilogue-header {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2d3748;
  text-align: center;
}
.btn-restart {
  padding: 0.75rem 1.5rem;
  background-color: #ff7e5f;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  margin-top: 1rem;
}
.btn-restart:hover {
  background-color: #ff6a48;
  transform: translateY(-2px);
}

.loading {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .chapter-view { margin: 1rem auto; }
  .chapter-container { padding: 1.5rem; }
  .chapter-title { font-size: 1.75rem; }
  .chapter-content { font-size: 1.1rem; line-height: 1.6; }
  .choices-list button { font-size: 1rem; padding: 0.8rem; }
}

@media (max-width: 480px) {
  .chapter-container { padding: 1rem; border-radius: 8px; }
  .chapter-title { font-size: 1.5rem; margin-bottom: 1rem; }
  .chapter-content { font-size: 1rem; margin-bottom: 1.5rem; }
  .choices-list button { padding: 0.7rem; }
  .btn-restart { padding: 0.7rem 1.2rem; }
}
</style>