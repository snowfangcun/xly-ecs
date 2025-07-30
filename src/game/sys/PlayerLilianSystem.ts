import { Entity, System } from '@/framework'
import { PlayerCore } from '../comp/PlayerComp'
import { WorldLilianRoom } from '../comp/WorldComp'
import { PlayerStartLilianEvent } from '../events/PlayerEvents'
import { queryPlayerByUid } from '../query/Query'

/**
 * 玩家历练系统
 */
export class PlayerLilianSystem extends System {
  constructor() {
    super()
  }

  onAddedToWorld(): void {
    this.eventSubscribe(PlayerStartLilianEvent, this.onStartLilian.bind(this))
  }

  private onStartLilian(event: PlayerStartLilianEvent) {
    const [player] = this.world.query(queryPlayerByUid(event.uid))
    const core = player.getComponent(PlayerCore)!
    if (core.currentEvent.type !== 'none') throw new Error(`角色${event.uid}正在执行其他事件`)
    // 创建历练房间
    const room = this.world.createEntity()
    room.addComponent(WorldLilianRoom, event.uid, event.worldPlaceKey)

    core.currentEvent = {
      type: 'li_lian',
      data: {},
    }
  }

  update(entities: Entity[]): void {}
}
