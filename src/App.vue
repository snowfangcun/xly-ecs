<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { startGame } from './game/Index'
import ThemeProvider, { type Theme } from './components/ThemeProvider.vue'

const theme = ref<Theme>({
  clickText: {
    textColor: '#fff',
    textSize: 20,
  },
})

onMounted(() => {
  startGame()
})
</script>

<template>
  <ThemeProvider :theme="theme">
    <RouterView />
  </ThemeProvider>
</template>

<style scoped></style>
