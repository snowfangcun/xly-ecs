import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const name = ref('')
  const exp = ref(0)
  const lv = ref(1)
  return { name, exp, lv }
})
