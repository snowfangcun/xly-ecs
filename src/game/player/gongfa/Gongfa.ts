/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@esengine/ecs-framework'
import type { BaseEffect } from '../effect/Effect'
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
    throw new Error('Method not implemented.')
  }
}

/**
 * 功法资源索引表
 */
export const GongFaResTable: Record<string, new () => BaseGongfa<any>> = {
  chang_chun_gong: GongfaChangChunGong,
} 

export class PlayerMainGongfaComp extends Component {
  gongfa: BaseGongfa<any> | null = null

  onAddedToEntity(): void {
    const core = this.entity.getComponent(PlayerCoreComp)!
    if(core.mainGongfa){
      const gf = GongFaResTable[core.mainGongfa[0]]
      this.gongfa = new GongFaResTable[core.mainGongfa[0]]()
    }
  }
}
