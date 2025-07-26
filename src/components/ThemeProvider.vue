<script setup lang="ts">
import { themeKey } from '@/common/key'
import { merge } from 'lodash'
import { defineProps, provide } from 'vue'

interface ClickTextThemeProps {
  textColor?: string
  bgColor?: string
  textSize?: number
}

export interface Theme {
  clickText?: {
    normal?: ClickTextThemeProps
    click?: ClickTextThemeProps
    disable?: ClickTextThemeProps
    hover?: ClickTextThemeProps
  }
}

export type RequiredTheme = Required<{
  clickText: Required<{
    normal: Required<ClickTextThemeProps>
    click: Required<ClickTextThemeProps>
    disable: Required<ClickTextThemeProps>
    hover: Required<ClickTextThemeProps>
  }>
}>

const props = defineProps<{ theme: Theme }>()

const defaultTheme: Theme = {
  clickText: {
    normal: {
      textColor: '#000',
      bgColor: '#fff',
      textSize: 12,
    },
    click: {
      textColor: '#fff',
      bgColor: '#000',
      textSize: 12,
    },
    disable: {
      textColor: '#999',
      bgColor: '#eee',
      textSize: 12,
    },
    hover: {
      textColor: '#000',
      bgColor: '#fff',
      textSize: 12,
    },
  },
}

const mergedTheme = merge({}, defaultTheme, props.theme)

provide(themeKey, mergedTheme)
</script>

<template>
  <slot />
</template>
