/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@esengine/ecs-framework'
import { EffectAddExp, type BaseEffect } from '../effect/Effect'
import { PlayerCoreComp } from '../Player'
import { getGongfaRes } from '../stuffbox/StuffRes'

/**
 * 所有功法的基类
 * 功法是effect的生产者，随着功法的执行，功法会根据功法数据源源不断的生成effect
 */
export abstract class BaseGongfa<T extends object> {
  data: T = null!

  constructor(data: T | null = null) {
    this.data = data ?? this.initData()
  }

  abstract initData(): T

  abstract execute(): BaseEffect[]

  onLearned(): BaseEffect[] {
    return []
  }

  onForget(): BaseEffect[] {
    return []
  }
}

type ChangChunGongData = {
  duration: number
}

export class GongfaChangChunGong extends BaseGongfa<ChangChunGongData> {
  initData(): ChangChunGongData {
    return { duration: 0 }
  }
  execute(): BaseEffect[] {
    this.data.duration += 1
    return [new EffectAddExp(1)]
  }
}

export class PlayerMainGongfaComp extends Component {
  gongfa: BaseGongfa<any> | null = null

  onAddedToEntity(): void {
    const core = this.entity.getComponent(PlayerCoreComp)!
    // 如果有主功法，则加载功法class
    if (core.mainGongfa) {
      const clz = getGongfaRes(core.mainGongfa[0]).clz
      this.gongfa = new clz(core.mainGongfa[1])
    }
  }
}
