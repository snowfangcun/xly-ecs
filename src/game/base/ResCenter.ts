/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunResourcesLoader, ObjectResourcesLoader } from '@/framework/Resources'
import type {
  BaseStuffResources,
  BuffData,
  BuffResources,
  GongfaPerData,
  GongfaResources,
} from './Types'
import { EffectAddExp, type Effect } from '../player/Effect'

const EXECUTE_CYCLE = 'EXECUTE_CYCLE'
const BASIC_EXP = 'BASIC_EXP'

/**
 * 功法资源
 */
export const gongfaResourcesLoader = new ObjectResourcesLoader<GongfaResources>().registerBatch({
  chang_qing_gong: {
    name: '长青功',
    type: 'gongfa',
    desc: '长青功',
    isStackable: false,
    useOptions: ['learn'],
    args: {
      EXECUTE_CYCLE: 2,
      BASIC_EXP: 1,
    },
    effectStr() {
      return `运功时，每${this.args[EXECUTE_CYCLE]}秒，增加${this.args[BASIC_EXP]}点修为`
    },
  },
})

/**
 * 功法效果触发器资源
 */
export const gongfaTriggerResourcesLoader = new FunResourcesLoader<
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

export const stuffResourcesLoader = new ObjectResourcesLoader<BaseStuffResources>()
  .merge(gongfaResourcesLoader)
  .toExport()

export const buffResourcesLoader = new ObjectResourcesLoader<BuffResources>().registerBatch({
  ju_qi: {
    name: '聚气',
    args: {
      count: 5,
    },
    desc() {
      return `每个周天的获得修为增加100%，剩余${this.args['count']}次`
    },
    isValid() {
      return this.args['count'] > 0
    },
  },
})

/**
 * buff效果触发
 */
export const buffTriggerResourcesLoader = new FunResourcesLoader<
  [args: Record<string, any>, data: BuffData, effect: Effect],
  {
    data: BuffData
    effects: Effect[]
  }
>().registerBatch({
  ju_qi: (args, data, effect) => {
    const count = data['count'] as number
    if (count <= 0) return { data, effects: [effect] }
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
