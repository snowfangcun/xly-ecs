import { Entity, EntitySystem, Matcher } from '@esengine/ecs-framework'
import { BaseEffect, PlayerEffectComp } from '../effect/Effect'
import { PlayerCoreComp } from '../Player'
import { BaseBuff, JuQiBuff, PlayerBuffComp } from './Buff'
import _ from 'lodash'

export class BuffSys extends EntitySystem {
  private _buffHandlers: BaseBuff[] = [new JuQiBuff()]

  constructor() {
    super(Matcher.empty().all(PlayerCoreComp, PlayerEffectComp))
  }

  process(entities: Entity[]): void {
    entities.forEach((e) => {
      const effect = e.getComponent(PlayerEffectComp)!
      const buff = e.getComponent(PlayerBuffComp)!

      const handler = buff.buffs.map(
        (b) => (effects: BaseEffect[]) =>
          this._buffHandlers.find((h) => h.key() === b[0])!.handleEffect(b[1], effects),
      )

      const pipefn = _.flow(handler)
      const result = pipefn(effect.effects) as BaseEffect[]

      effect.effects = result

      // 清除无效的buff
      buff.buffs = buff.buffs.filter((b) => {
        return this._buffHandlers.find((h) => h.key() === b[0])!.isValid(b[1])
      })
    })
  }
}
