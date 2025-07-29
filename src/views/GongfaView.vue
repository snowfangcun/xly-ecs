<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { GONGFA_RES } from '@/game/base/ResCenter'
import { PlayerFinishXiulianEvent, PlayerStartXiulianEvent } from '@/game/events/PlayerEvents'
import { getWorld } from '@/game/Game'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const world = getWorld()
const gameStore = useGameStore()

const data = computed(() => {
  if (!gameStore.gongfa) return undefined
  const res = GONGFA_RES.get(gameStore.gongfa.key)
  return {
    res: res,
    ...gameStore.gongfa,
  }
})

function start() {
  world.emitEvent(new PlayerStartXiulianEvent())
}

function finish() {
  world.emitEvent(new PlayerFinishXiulianEvent())
}
</script>
<template>
  <div>
    <div v-if="gameStore.gongfa">
      <span>{{ data?.res.name }}</span
      ><br />
      <span>效果：{{ data?.res.effectStr() }}</span
      ><br />
      <div v-if="gameStore.currentEvent?.type === 'none'">
        <span>当前状态：未修炼</span><br />
        <ClickText text="修炼" v-on:click="start" />
      </div>
      <div v-else>
        <span>当前状态：修炼中</span><br />
        <ClickText text="收工" v-on:click="finish" />
      </div>
    </div>
    <div v-else>
      <span>尚未修习功法</span>
    </div>
  </div>
</template>
