<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { PlayerBagAddItemEvent } from '@/game/events/PlayerEvents'
import { getWorld } from '@/game/Game'

function addTestGongfa() {
  console.log('addTestGongfa')
  getWorld().emitEvent(new PlayerBagAddItemEvent('chang_qing_gong', 1))
}
</script>
<template>
  <div>
    <ClickText text="增加测试功法" v-on:click="addTestGongfa()" />
  </div>
</template>
