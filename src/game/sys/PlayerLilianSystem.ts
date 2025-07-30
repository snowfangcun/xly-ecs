import { Entity, System } from '@/framework'
import { PlayerCore } from '../comp/PlayerComp'
import { WorldLilianRoom } from '../comp/WorldComp'
import { PlayerBagAddItemEvent, PlayerStartLilianEvent } from '../events/PlayerEvents'
import { queryPlayerByUid } from '../query/Query'
import { WORLD_PLACE_RES } from '../base/ResCenter'
import { weightedRandom } from '../tool/MathTools'
import type { WorldPlaceResources } from '../base/Types'

/**
 * 玩家历练系统
 */
export class PlayerLilianSystem extends System {
  constructor() {
    super({ all: [WorldLilianRoom] })
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

  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const room = entity.getComponent(WorldLilianRoom)!
      const worldBlockRes = WORLD_PLACE_RES.get(room.worldPlaceKey)
      // 随机抽取历练事件
      const eventIndex = weightedRandom(worldBlockRes.events)
      const selectedEvent = worldBlockRes.events[eventIndex]
      switch (selectedEvent.type) {
        case 'stuff_collect':
          this.onSelectStuffCollect(entity, worldBlockRes)
          break
        case 'meet_enemy':
      }
    })
  }

  /**
   * 进行历练的收集物品事件
   * @param e
   * @param res
   */
  private onSelectStuffCollect(e: Entity, res: Readonly<WorldPlaceResources>) {
    // 按稀有度权重随机抽取一个物品
    const itemIndex = weightedRandom(res.stuffItems)
    const selectedItem = res.stuffItems[itemIndex]
    // 随机生成数量，1到maxCount之间
    const count = Math.floor(Math.random() * selectedItem.maxCount) + 1
    // 派发添加物品事件
    this.eventDispatch(new PlayerBagAddItemEvent(selectedItem.key, count))
  }
}
