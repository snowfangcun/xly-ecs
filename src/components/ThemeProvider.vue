<script setup lang="ts">
import { defineProps, provide } from 'vue'

export interface Theme {
  clickText: {
    textColor: string
    textSize: number
  }
}

const props = defineProps<{ theme: Theme }>()

provide('theme', props)
</script>

<template>
  <div></div>
</template>
