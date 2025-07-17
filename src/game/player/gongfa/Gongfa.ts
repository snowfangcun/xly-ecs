/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@esengine/ecs-framework'
import { EffectAddExp, type BaseEffect } from '../effect/Effect'
import { PlayerCoreComp } from '../Player'

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

/**
 * 功法资源索引表
 */
export const GongFaResTable: Record<string, new (data: any | null) => BaseGongfa<any>> = {
  chang_chun_gong: GongfaChangChunGong,
}

export class PlayerMainGongfaComp extends Component {
  gongfa: BaseGongfa<any> | null = null

  onAddedToEntity(): void {
    const core = this.entity.getComponent(PlayerCoreComp)!
    // 如果有主功法，则加载功法class
    if (core.mainGongfa) {
      this.gongfa = new GongFaResTable[core.mainGongfa[0]](core.mainGongfa[1])
    }
  }
}
