<script setup lang="ts">
import { defineProps, inject } from 'vue'
import type { Theme } from './ThemeProvider.vue'
import { themeKey } from '@/common/key'

const props = defineProps<{ text: string }>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const theme = inject<Theme>(themeKey)
</script>

<template>
  <span
    v-on:click="() => emit('click')"
    :style="{
      color: theme?.clickText.textColor ? theme.clickText.textColor : '#000',
      fontSize: `${theme?.clickText ? theme.clickText.textSize : 16}px`,
    }"
    >{{ props.text }}</span
  >
</template>
