import { Component } from '@esengine/ecs-framework'

export abstract class BaseEffect {}

export class EffectAddExp extends BaseEffect {
  constructor(public exp: number) {
    super()
  }
}

export class PlayerEffectComp extends Component {
  effects: BaseEffect[] = []

  addEffect(effect: BaseEffect) {
    this.effects.push(effect)
  }

  cllear() {
    this.effects = []
  }

  isEmpty() {
    return this.effects.length === 0
  }
}
