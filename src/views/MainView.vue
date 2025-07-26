<script setup lang="ts">
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
  </div>
</template>
