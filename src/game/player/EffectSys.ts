import { Entity, EntitySystem, Matcher } from '@esengine/ecs-framework'
import { EffectAddExp, PlayerEffectComp } from './Effect'
import { PlayerCoreComp } from './Player'

export class EffectSys extends EntitySystem {
  constructor() {
    super(Matcher.empty().all(PlayerCoreComp, PlayerEffectComp))
  }
  process(entities: Entity[]): void {
    entities.forEach((e) => {
      const core = e.getComponent(PlayerCoreComp)!
      const effect = e.getComponent(PlayerEffectComp)!
      effect?.effects.forEach((e) => {
        if (e instanceof EffectAddExp) {
          this.addExp(core, e)
        }
      })
    })
  }

  private addExp(core: PlayerCoreComp, effect: EffectAddExp) {
    core.addExp(effect.exp)
  }
}
