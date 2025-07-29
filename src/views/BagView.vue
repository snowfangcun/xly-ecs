<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { STUFF_RES } from '@/game/base/ResCenter'
import router from '@/router'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const gameStore = useGameStore()

const items = computed(() => {
  return gameStore.bag.items.map((item) => {
    const res = STUFF_RES.get(item.key)
    return {
      uuid: item.uuid,
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
      <ClickText
        :text="item.name"
        v-on:click="() => router.push({ name: 'bagItem', params: { uuid: item.uuid } })"
      />
      <span>x{{ item.count }}</span>
    </div>
    <div v-if="items.length === 0">
      <span>暂无物品</span>
    </div>
  </div>
</template>
