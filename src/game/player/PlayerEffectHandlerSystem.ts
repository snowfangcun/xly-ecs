import { System } from '@/framework'
import { EffectAddExp } from './Effect'
import { queryPlayer } from '../query/Query'
import { PlayerCore } from './PlayerComp'

/**
 * 玩家效果处理系统
 */
export class PlayerEffectHandlerSystem extends System {
  onAddedToWorld(): void {
    this.eventSubscribe(EffectAddExp, this.onEffectAddExp.bind(this))
  }

  /**
   * 处理经验增加效果
   * @param event
   */
  private onEffectAddExp(event: EffectAddExp): void {
    const player = this.world!.query(queryPlayer).find(
      (e) => e.getComponent(PlayerCore)!.uid === event.uid,
    )!
    const core = player.getComponent(PlayerCore)!
    core.addExp(event.exp)
  }

  update(): void {}
}
