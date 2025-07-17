<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ClickText from './components/ClickText.vue'
import ThemeProvider, { type Theme } from './components/ThemeProvider.vue'
import { startGame } from './game/Index'

const theme = ref<Theme>({
  clickText: {
    textColor: '#1d953f',
    textSize: 20,
  },
})

const clickEvent = () => startGame()
</script>

<template>
  <ThemeProvider :theme="theme">
    <ClickText text="点击开始游戏" @click="clickEvent" />
    <RouterView />
  </ThemeProvider>
</template>

<style scoped></style>
