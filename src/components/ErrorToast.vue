<!-- src/components/ErrorToast.vue -->
<template>
  <!-- Affiche le toast uniquement s’il est visible -->
  <div v-if="visible" class="error-toast">
    <!-- Affiche le message d’erreur passé via la prop -->
    <p>{{ props.modelValue.message }}</p>
    <!-- Bouton pour fermer manuellement le toast -->
    <button @click="visible = false">×</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Définition des props : ici, on attend un objet représentant l’erreur
// `modelValue` suit la convention des composants contrôlés (comme v-model)
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

// État local pour afficher ou masquer le toast
const visible = ref(false)

// Surveille les changements de la prop modelValue
// Lorsqu'une erreur est détectée, on affiche le toast
watch(
  () => props.modelValue,
  (err) => {
    if (err) {
      visible.value = true
      // Masquer automatiquement après 4 secondes
      setTimeout(() => (visible.value = false), 4000)
    }
  }
)
</script>

<style scoped>
/* Style du toast d’erreur */
.error-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #e53e3e; /* Rouge foncé */
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
}

/* Style du bouton pour fermer manuellement le toast */
.error-toast button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 1rem;
  cursor: pointer;
}
</style>