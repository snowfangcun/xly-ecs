<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { stuffResourcesLoader } from '@/game/base/ResCenter'
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const gameStore = useGameStore()

// 从路由中获取参数
const route = useRoute()
const uuid = route.params.uuid as string

const item = computed(() => {
  const i = gameStore.bag.items.find((item) => item.uuid === uuid)
  if (!i) throw new Error('item not found')
  const res = stuffResourcesLoader.get(i.key)
  return {
    res: res,
    ...i,
  }
})

const itemOptions = computed(() => [...item.value.res.useOptions, 'discard'])

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
</script>
<template>
  <div>
    <span>{{ item.res.name }}</span
    ><br />
    <span>数量：{{ item.count }}</span><br>
    <span>描述：{{ item.res.desc }}</span>
  </div>
  <div>
    <template v-for="option in itemOptions" :key="option">
      [<ClickText :text="getItemOptionStr(option)" />]
    </template>
  </div>
</template>
