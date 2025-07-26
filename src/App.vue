<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import ThemeProvider, { type Theme } from './components/ThemeProvider.vue'

const theme = ref<Theme>({
  clickText: {
    normal: {
      textColor: '#1d953f',
      textSize: 20,
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
