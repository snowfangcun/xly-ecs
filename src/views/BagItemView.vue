<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { STUFF_RES } from '@/game/base/ResCenter'
import type { GongfaResources } from '@/game/base/Types'
import { PlayerBagUseItemEvent } from '@/game/events/PlayerEvents'
import { getWorld } from '@/game/Game'
import router from '@/router'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const world = getWorld()
const gameStore = useGameStore()

// 从路由中获取参数
const route = useRoute()
const uuid = route.params.uuid as string

const item = computed(() => {
  // 强制依赖 gameStore.bag 来确保响应性
  const i = gameStore.bag.items.find((item) => item.uuid === uuid)
  if (!i) {
    router.back()
    return undefined
  }
  const res = STUFF_RES.get(i.key)
  return {
    res: res,
    ...i,
  }
})

const itemOptions = computed(() => [...(item.value?.res.useOptions || []), 'discard'])

function getItemOptionStr(option: string): string {
  let str = ''
  switch (option) {
    case 'learn':
      str = '修习'
      break
    case 'discard':
      str = '丢弃'
      break
  }
  return str
}

/**
 * 使用物品
 * @param option 使用选项
 */
function useItem(option: string) {
  if (!item.value) return
  world.emitEvent(new PlayerBagUseItemEvent(item.value.uuid, item.value.key, option))
}
</script>
<template>
  <div>
    <span>{{ item?.res.name }}</span
    ><br />
    <span>数量：{{ item?.count }}</span
    ><br />
    <template v-if="item?.res.type === 'gongfa'">
      <span>效果：{{ (item.res as GongfaResources).effectStr() }}</span
      ><br />
    </template>
    <span>描述：{{ item?.res.desc }}</span>
  </div>
  <div>
    <template v-for="option in itemOptions" :key="option">
      [<ClickText :text="getItemOptionStr(option)" v-on:click="useItem(option)" />]
    </template>
  </div>
</template>
