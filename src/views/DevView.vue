<script setup lang="ts">
import ClickText from '@/components/ClickText.vue'
import { PlayerAddBuffEvent, PlayerBagAddItemEvent } from '@/game/events/PlayerEvents'
import { getWorld } from '@/game/Game'

function addTestGongfa() {
  getWorld().emitEvent(new PlayerBagAddItemEvent('chang_qing_gong', 1))
}

function addJuqiBuff() {
  getWorld().emitEvent(new PlayerAddBuffEvent('p1', 'ju_qi'))
}
</script>
<template>
  <div>
    <ClickText text="增加测试功法" v-on:click="addTestGongfa()" />
    <ClickText text="增加聚气buff" v-on:click="addJuqiBuff()" />
  </div>
</template>
