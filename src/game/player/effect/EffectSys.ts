import { Entity, EntitySystem, Matcher } from '@esengine/ecs-framework'
import { EffectAddExp, PlayerEffectComp } from './Effect'
import { PlayerCoreComp } from '../Player'

export class EffectSys extends EntitySystem {
  constructor() {
    super(Matcher.empty().all(PlayerCoreComp, PlayerEffectComp))
  }
  process(entities: Entity[]): void {
    entities.forEach((e) => {
      const core = e.getComponent(PlayerCoreComp)!
      const effect = e.getComponent(PlayerEffectComp)!
      while (!effect.isEmpty()) {
        this.handleEffect(core, effect)
      }
    })
  }

  /**
   * 处理effect
   * @param core
   * @param eff
   */
  private handleEffect(core: PlayerCoreComp, eff: PlayerEffectComp) {
    // 从eff的集合移除并返回第一个元素
    const effect = eff.effects.shift()
    if (effect instanceof EffectAddExp) this.addExp(core, effect)
  }

  /**
   * 处理增加exp效果
   * @param core
   * @param effect
   */
  private addExp(core: PlayerCoreComp, effect: EffectAddExp) {
    core.addExp(effect.exp)
  }
}
