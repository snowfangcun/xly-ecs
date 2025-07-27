/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunResourcesLoader, ObjectResourcesLoader } from '@/framework/Resources'
import type { BaseStuffResources, GongfaPerData, GongfaResources } from './Types'
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
  [args: Record<string, any>, duration: number, data: GongfaPerData],
  {
    data: GongfaPerData
    effects: Effect[]
  }
>().registerBatch({
  chang_qing_gong: (args, duration, data) => {
    const executeCycle = args[EXECUTE_CYCLE] || 1
    const basicExp = args[BASIC_EXP] || 1
    const perCycle = data['cycle'] || 0
    // 周天检查
    if (perCycle !== executeCycle) {
      data['cycle'] += 1
      return {
        data,
        effects: [],
      }
    }
    data['cycle'] = 0
    return {
      data,
      effects: [new EffectAddExp('1', basicExp)],
    }
  },
})

export const stuffResourcesLoader = new ObjectResourcesLoader<BaseStuffResources>()
  .merge(gongfaResourcesLoader)
  .toExport()
