<template>
  <div class="chapter-view">
    <button class="btn-back" @click="goBack">← Retour aux histoires</button>

    <!-- TITRE -->
    <h2 v-if="chapter" class="chapter-title">{{ chapter.title }}</h2>

    <!-- CONTENU & CHOIX -->
    <div v-if="chapter && chapter.choices.length">
      <!-- Contenu normal d'un chapitre intermédiaire -->
      <p class="chapter-content">{{ chapter.content }}</p>

      <ul class="choices-list">
        <li v-for="choice in chapter.choices" :key="choice.id">
          <button @click="selectChoice(choice.target_chapter_id)">
            {{ choice.text }}
          </button>
        </li>
      </ul>
    </div>

    <!-- ÉPILOGUE / FIN -->
    <div v-else-if="chapter">
      <div class="epilogue-header">
        🏁 <strong>Épilogue</strong>
      </div>

      <!-- Contenu de l'épilogue (une seule fois) -->
      <p class="chapter-content">{{ chapter.content }}</p>

      <button class="btn-restart" @click="restartStory">
        🔄 Recommencer l'histoire
      </button>
    </div>

    <!-- LOADER -->
    <p v-else class="loading">Chargement du chapitre…</p>
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
.chapter-view { max-width:600px; margin:2rem auto; padding:0 1rem; }
.btn-back     { background:none; border:none; color:#42b883; margin-bottom:1rem; cursor:pointer; }
.chapter-title { font-size:1.5rem; margin-bottom:.5rem; }
.chapter-content { margin-bottom:1.5rem; line-height:1.6; }
.choices-list { list-style:none; padding:0; }
.choices-list button { display:block; width:100%; margin-bottom:.5rem; padding:.75rem; background:#42b883; color:#fff; border:none; border-radius:4px; cursor:pointer; }
.choices-list button:hover { background:#369f6b; }

.epilogue { text-align:center; margin-top:2rem; }
.epilogue p:first-child { font-size:1.2rem; margin-bottom:1rem; }
.btn-restart { padding:.75rem 1.5rem; background:#42b883; color:#fff; border:none; border-radius:4px; cursor:pointer; }
.btn-restart:hover { background:#369f6b; }

.loading { text-align:center; color:#666; font-style:italic; }
</style>