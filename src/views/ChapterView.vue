<template>
  <div class="chapter-view">
    <button class="btn-back" @click="goBack">← Retour aux histoires</button>

    <div class="chapter-container">
      <!-- TITRE -->
      <h2 v-if="chapter" class="chapter-title">{{ chapter.title }}</h2>

      <!-- CONTENU & CHOIX -->
      <div v-if="chapter && chapter.choices.length">
        <!-- Contenu normal d'un chapitre intermédiaire -->
        <div class="chapter-content">{{ chapter.content }}</div>

        <ul class="choices-list">
          <li v-for="choice in chapter.choices" :key="choice.id">
            <button @click="selectChoice(choice.target_chapter_id)">
              {{ choice.text }}
            </button>
          </li>
        </ul>
      </div>

      <!-- ÉPILOGUE / FIN -->
      <div v-else-if="chapter" class="epilogue">
        <div class="epilogue-header">
          🏁 <strong>FIN</strong>
        </div>

        <!-- Contenu de l'épilogue (une seule fois) -->
        <div class="chapter-content">{{ chapter.content }}</div>

        <button class="btn-restart" @click="restartStory">
          🔄 Recommencer l'histoire
        </button>
      </div>

      <!-- LOADER -->
      <p v-else class="loading">Chargement du chapitre…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter }   from 'vue-router';
import { getChapter, getChapterByOrder } from '../api/api';

const route  = useRoute();
const router = useRouter();

const chapter = ref(null);
const sid     = route.params.sid;
const cid     = ref(Number(route.params.cid)); // Maintenant cid représente l'ordre (1, 2, 3...) et non plus l'ID du chapitre

async function loadChapter(order) {
  chapter.value = null;
  try {
    // On utilise getChapterByOrder au lieu de getChapter
    const { data } = await getChapterByOrder(sid, order);
    chapter.value = data.data;
    // On stocke toujours l'ordre du chapitre (et non son ID) dans localStorage
    localStorage.setItem(`progress_story_${sid}`, order);
  } catch {
    router.push({ name: 'Stories' });
  }
}

onMounted(() => loadChapter(cid.value));
watch(() => route.params.cid, newCid => loadChapter(Number(newCid)));

function selectChoice(nextChapterId) {
  if (nextChapterId) {
    // Ici, nextChapterId est toujours l'ID réel du chapitre cible
    // On a besoin de connaître son ordre pour la navigation
    getChapter(sid, nextChapterId)
      .then(({ data }) => {
        // On suppose que le chapitre retourné contient une propriété "order"
        const nextOrder = data.data.order;
        router.push({ name: 'Chapter', params: { sid, cid: nextOrder } });
      })
      .catch(() => {
        router.push({ name: 'Stories' });
      });
  }
}

function goBack() {
  router.push({ name: 'Stories' });
}

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

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .chapter-view {
    margin: 1rem auto;
  }
  
  .chapter-container {
    padding: 1.5rem;
  }
  
  .chapter-title {
    font-size: 1.75rem;
  }
  
  .chapter-content {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .choices-list button {
    font-size: 1rem;
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .chapter-container {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .chapter-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .chapter-content {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .choices-list button {
    padding: 0.7rem;
  }
  
  .btn-restart {
    padding: 0.7rem 1.2rem;
  }
}
</style>