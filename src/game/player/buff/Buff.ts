import { Component } from '@esengine/ecs-framework'
import { EffectAddExp, type BaseEffect } from '../effect/Effect'

export abstract class BaseBuff<T extends object = object> {
  abstract key(): string

  abstract initData(): T

  abstract mergeData(oldData: T, newData: T): T

  abstract handleEffect(data: T, effect: BaseEffect[]): BaseEffect[]

  abstract isValid(data: T): boolean
}

type JuQiBuffData = {
  count: number
}

export class JuQiBuff extends BaseBuff<JuQiBuffData> {
  key(): string {
    return 'juqi'
  }
  initData(): JuQiBuffData {
    return { count: 2 }
  }

  mergeData(oldData: JuQiBuffData, newData: JuQiBuffData): JuQiBuffData {
    return {
      count: oldData.count + newData.count,
    }
  }

  handleEffect(data: JuQiBuffData, effect: BaseEffect[]): BaseEffect[] {
    return effect.map((e) => {
      if (e instanceof EffectAddExp && this.isValid(data)) {
        e.exp *= 2
        data.count--
      }
      return e
    })
  }

  isValid(data: JuQiBuffData): boolean {
    return data.count > 0
  }
}

export class PlayerBuffComp extends Component {
  constructor(public buffs: (readonly [string, object])[] = []) {
    super()
  }

  addBuff(key: string, data: object): void {
    this.buffs.push([key, data])
  }
}
