import { Entity, EntitySystem, Matcher } from '@esengine/ecs-framework'
import { PlayerEffectComp } from '../effect/Effect'
import { PlayerCoreComp } from '../Player'
import { PlayerMainGongfaComp } from './Gongfa'

export class GongfaSys extends EntitySystem {
  constructor() {
    super(Matcher.empty().all(PlayerCoreComp, PlayerEffectComp, PlayerMainGongfaComp))
  }

  public process(entities: Entity[]): void {
    entities.forEach((e) => {
      const effect = e.getComponent(PlayerEffectComp)!
      const mainGongfa = e.getComponent(PlayerMainGongfaComp)!
      if (!mainGongfa.gongfa) return
      // 执行功法
      mainGongfa.gongfa.execute().forEach(effect.addEffect)
    })
  }
}
