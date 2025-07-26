<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { useGameStore } from '@/stores/game'
const game = useGameStore()
</script>
<template>
  <div>
    <div>
      <span>姓名：{{ game.name }}</span
      >(lv{{ game.lv }})<br />
      <span>修为：{{ game.exp }}</span>
    </div>
    <div><ClickText text="储物" />|<ClickText text="功法" /></div>
  </div>
</template>
