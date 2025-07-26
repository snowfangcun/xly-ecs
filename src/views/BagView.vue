<script setup lang="ts">
import { stuffResourcesLoader } from '@/game/base/ResCenter'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const gameStore = useGameStore()

const items = computed(() => {
  return gameStore.bag.items.map((item) => {
    const res = stuffResourcesLoader.get(item.key)
    return {
      key: item.key,
      count: item.count,
      name: res.name,
    }
  })
})
</script>
<template>
  <span>储物</span>
  <div>
    <div v-for="item in items" :key="item.key">
      <span>{{ item.name }}x{{ item.count }}</span>
    </div>
  </div>
</template>
