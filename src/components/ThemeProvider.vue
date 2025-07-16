<script setup lang="ts">
import { themeKey } from '@/common/key'
import { defineProps, provide } from 'vue'

export interface Theme {
  clickText: {
    textColor: string
    textSize: number
  }
}

const props = defineProps<{ theme: Theme }>()

provide(themeKey, props.theme)
</script>

<template>
  <slot />
</template>
