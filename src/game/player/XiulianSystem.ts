import { Entity, EntitySystem, Matcher } from '@esengine/ecs-framework'
import { EffectAddExp, PlayerEffectComp } from './effect/Effect'
import { PlayerCoreComp } from './Player'

export class PlayerXiulianSys extends EntitySystem {
  constructor() {
    super(Matcher.empty().all(PlayerCoreComp, PlayerEffectComp))
  }

  public process(entities: Entity[]): void {
    entities.forEach((e) => {
      const effect = e.getComponent(PlayerEffectComp)!
      effect.addEffect(new EffectAddExp(1))
    })
  }
}
