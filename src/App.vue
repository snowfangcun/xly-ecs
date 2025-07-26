<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ThemeProvider, { type Theme } from './components/ThemeProvider.vue'

const theme = ref<Theme>({
  clickText: {
    normal: {
      bgColor: 'transparent',
      textColor: '#2570a1',
      textSize: 16,
    },
    click: {
      bgColor: '#145b7d',
      textColor: '#fffef9',
      textSize: 16,
    },
    hover: {
      bgColor: 'transparent',
      textColor: '#145b7d',
      textSize: 16,
    },
  },
})
</script>

<template>
  <ThemeProvider :theme="theme">
    <RouterView />
  </ThemeProvider>
</template>
<style scoped></style>
