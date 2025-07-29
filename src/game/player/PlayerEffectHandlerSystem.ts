import { Entity, System } from '@/framework'
import { EffectAddExp } from './Effect'
import { PlayerCore, PlayerEffectCache } from './PlayerComp'

/**
 * 玩家效果处理系统
 */
export class PlayerEffectHandlerSystem extends System {
  constructor() {
    super({ all: [PlayerCore] })
  }

  /**
   * 处理经验增加效果
   * @param event
   */
  private onEffectAddExp(playerCore: PlayerCore, event: EffectAddExp): void {
    playerCore.addExp(event.exp)
  }

  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const core = entity.getComponent(PlayerCore)!
      const effectCache = entity.getComponent(PlayerEffectCache)!
      effectCache.effects.forEach((effect) => {
        if (effect instanceof EffectAddExp) this.onEffectAddExp(core, effect)
      })
    })
  }
}
