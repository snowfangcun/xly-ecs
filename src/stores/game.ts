import type {
  MetaAttr,
  PlayerEventData,
  PlayerGongfaData,
  StateProps,
  StuffBoxData,
} from '@/game/base/Types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  const name = ref('')
  const exp = ref(0)
  const expMax = ref(0)
  const lv = ref(1)
  const bag = ref<StuffBoxData>({
    items: [],
  })
  const gongfa = ref<PlayerGongfaData>()
  const currentEvent = ref<PlayerEventData>()
  const state = ref<Partial<StateProps>>()
  const metaAttr = ref<Partial<MetaAttr>>()

  return { name, exp, expMax, lv, bag, gongfa, currentEvent, state, metaAttr }
})
