<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import router from '@/router'
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>
<template>
  <div>
    <div>
      <span>姓名：{{ game.name }}</span
      >(lv{{ game.lv }})<br />
      <span>修为：{{ game.exp }}/{{ game.expMax }}</span
      ><br />
      <span>气血：{{ game.state?.hp || 0 }}/{{ game.metaAttr?.hpMax || 0 }}</span><br>
      <span>法力：{{ game.state?.mp || 0 }}/{{ game.metaAttr?.mpMax || 0 }}</span>
    </div>
    <div>
      <ClickText text="储物" v-on:click="() => router.push({ name: 'bag' })" />|
      <ClickText text="功法" v-on:click="() => router.push({ name: 'gongfa' })" />
    </div>
  </div>
  <div>
    <ClickText text="控制台" v-on:click="() => router.push({ name: 'dev' })" />
  </div>
</template>
