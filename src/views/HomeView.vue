<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { startGame } from '@/game/Game'
import router from '@/router'

const clickEvent = () => startGame()
</script>

<template>
  <main>
    <ClickText text="运行游戏" @click="clickEvent" /> <br />
    <ClickText
      text="进入游戏"
      @click="
        () => {
          router.push({ name: 'home' })
        }
      "
    />
  </main>
</template>
