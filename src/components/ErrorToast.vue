<!-- src/components/ErrorToast.vue -->
<template>
  <div v-if="visible" class="error-toast">
    <p>{{ props.modelValue.message }}</p>
    <button @click="visible = false">×</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// ⚠️ UNE SEULE FOIS defineProps
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  }
})

const visible = ref(false)

// Quand on reçoit une erreur, on affiche le toast
watch(
  () => props.modelValue,
  (err) => {
    if (err) {
      visible.value = true
      // Cache le toast après 4s
      setTimeout(() => (visible.value = false), 4000)
    }
  }
)
</script>

<style scoped>
.error-toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #e53e3e;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
}
.error-toast button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 1rem;
  cursor: pointer;
}
</style>