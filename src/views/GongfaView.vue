<script setup lang="ts">
import { gongfaResourcesLoader } from '@/game/base/ResCenter'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const gameStore = useGameStore()

const data = computed(() => {
  if (!gameStore.gongfa) return undefined
  const res = gongfaResourcesLoader.get(gameStore.gongfa.key)
  return {
    res: res,
    ...gameStore.gongfa,
  }
})
</script>
<template>
  <div>
    <div v-if="gameStore.gongfa">
      <span>{{ data?.res.name }}</span
      ><br />
      <span>效果：{{ data?.res.effectStr() }}</span
      ><br />
    </div>
    <div v-else>
      <span>尚未修习功法</span>
    </div>
  </div>
</template>
