/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunResourcesLoader, ObjectResourcesLoader } from '@/framework/Resources'
import { EffectAddExp, type Effect } from '../player/Effect'
import type {
  BaseStuffResources,
  BuffData,
  BuffResources,
  GongfaPerData,
  GongfaResources,
  LingPlantResources,
  WorldPlaceResources,
} from './Types'

const EXECUTE_CYCLE = 'EXECUTE_CYCLE'
const BASIC_EXP = 'BASIC_EXP'

/**
 * 功法资源
 */
export const GONGFA_RES = new ObjectResourcesLoader<GongfaResources>().registerBatchOmit<
  'type' | 'isStackable'
>(
  {
    type: 'gongfa',
    isStackable: false,
  },
  {
    chang_qing_gong: {
      name: '长青功',
      desc: '长青功',
      level: 1,
      triggerFnKey: 'chang_qing_gong',
      useOptions: ['learn'],
      args: {
        EXECUTE_CYCLE: 2,
        BASIC_EXP: 1,
      },
      effectStr() {
        return `运功时，每${this.args[EXECUTE_CYCLE]}秒，增加${this.args[BASIC_EXP]}点修为`
      },
    },
  },
)

/**
 * 功法效果触发器资源
 */
export const GONGFA_TRIGGER_RES = new FunResourcesLoader<
  [uid: string, args: Record<string, any>, duration: number, data: GongfaPerData],
  {
    data: GongfaPerData
    duration: number
    effects: Effect[]
  }
>().registerBatch({
  chang_qing_gong: (uid, args, duration, data) => {
    const executeCycle = args[EXECUTE_CYCLE] || 1
    const basicExp = args[BASIC_EXP] || 1
    const perCycle = data['cycle'] || 0
    // 周天检查
    if (perCycle < executeCycle) {
      data['cycle'] = perCycle + 1
      return {
        data,
        duration,
        effects: [],
      }
    }
    data['cycle'] = 0
    return {
      data,
      duration: duration + 1,
      effects: [new EffectAddExp(basicExp)],
    }
  },
})

export const BUFF_RES = new ObjectResourcesLoader<BuffResources>().registerBatch({
  ju_qi: {
    name: '聚气',
    triggerFnKey: 'ju_qi',
    args: {},
    initData: () => ({
      count: 5,
    }),
    desc() {
      return `每个周天的获得修为增加100%，剩余${this.args['count']}次`
    },
    isValid: (data) => data['count'] > 0,
    merge(oldData, newData) {
      return {
        count: oldData['count'] + newData['count'],
      }
    },
  },
})

/**
 * buff效果触发
 */
export const BUFF_TRIGGER_RES = new FunResourcesLoader<
  [args: Record<string, any>, data: BuffData, effect: Effect],
  {
    data: BuffData
    effects: Effect[]
  }
>().registerBatch({
  ju_qi: (args, data, effect) => {
    const count = data['count'] as number

    // 扣减一次次数
    data['count'] = count - 1
    if (effect instanceof EffectAddExp) {
      // 修为翻倍
      effect.exp *= 2
    }
    return {
      data,
      effects: [effect],
    }
  },
})

/**
 * 灵药资源
 */
export const LING_PLANT_RES = new ObjectResourcesLoader<LingPlantResources>().registerBatchOmit<
  'type' | 'isStackable'
>(
  {
    type: 'ling_plant',
    isStackable: true,
  },
  {
    chi_long_cao: {
      name: '赤龙草',
      desc: '赤龙草',
      lingAttr: 'fire',
      level: 1,
      useOptions: [],
    },
    xiao_lu_cao: {
      name: '小露草',
      desc: '小露草',
      lingAttr: 'water',
      level: 1,
      useOptions: [],
    },
  },
)

export const STUFF_RES = new ObjectResourcesLoader<BaseStuffResources>()
  .merge(GONGFA_RES, LING_PLANT_RES)
  .toExport()

/**
 * 世界地点资源
 */
export const WORLD_PLACE_RES = new ObjectResourcesLoader<WorldPlaceResources>().registerBatch({
  fu_long_jian: {
    name: '伏龙涧',
    desc: '伏龙涧',
    costEnergy: 5,
    stuffItems: [
      {
        key: 'chi_long_cao',
        rarity: 1,
        maxCount: 1,
      },
    ],
    events: [
      {
        type: 'empty',
        rarity: 1,
      },
      {
        type: 'stuff_collect',
        rarity: 20,
      },
    ],
  },
})
