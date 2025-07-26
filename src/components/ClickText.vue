<script setup lang="ts">
import { themeKey } from '@/common/key'
import { computed, defineProps, inject, ref } from 'vue'
import type { RequiredTheme } from './ThemeProvider.vue'

const props = defineProps<{ text: string }>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const theme = inject<RequiredTheme>(themeKey)

// 定义当前状态
const state = ref<'normal' | 'hover' | 'click'>('normal')

// 计算样式对象
const computedStyle = computed(() => {
  const currentState = theme?.clickText?.[state.value]
  return {
    color: currentState?.textColor || '#000',
    backgroundColor: currentState?.bgColor || '#fff',
    fontSize: `${currentState?.textSize || 12}px`,
    padding: '1px 1px',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    border: 'none',
  }
})
</script>

<template>
  <span
    class="click-text"
    :style="computedStyle"
    @click="() => emit('click')"
    @mouseover="state = 'hover'"
    @mouseleave="state = 'normal'"
    @mousedown="state = 'click'"
    @mouseup="state = 'normal'"
  >
    {{ props.text }}
  </span>
</template>

<style lang="css" scoped>
.click-text {
  /* 禁止复制 */
  user-select: none;
}
</style>
