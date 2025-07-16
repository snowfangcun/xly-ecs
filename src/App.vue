<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { startGame } from './game/Index'
import ThemeProvider, { type Theme } from './components/ThemeProvider.vue'
import ClickText from './components/ClickText.vue'

const theme = ref<Theme>({
  clickText: {
    textColor: '#1d953f',
    textSize: 20,
  },
})

onMounted(() => {
  startGame()
})
</script>

<template>
  <ThemeProvider :theme="theme">
    <ClickText text="点击开始游戏" @click="() => console.log('点击开始游戏')" />
    <RouterView />
  </ThemeProvider>
</template>

<style scoped></style>
