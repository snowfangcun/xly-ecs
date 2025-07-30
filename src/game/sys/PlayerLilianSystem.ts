import { Entity, System } from '@/framework'
import { STUFF_RES, WORLD_MAP_RES } from '../base/ResCenter'
import type { WorldMapResources } from '../base/Types'
import { PlayerCore } from '../comp/PlayerComp'
import { WorldLilianRoom } from '../comp/WorldComp'
import { PlayerStartLilianEvent } from '../events/PlayerEvents'
import { queryPlayerByUid } from '../query/Query'
import { StuffBox } from '../stuff/StuffComp'
import { weightedRandom } from '../tool/MathTools'
import { useGameStore } from '@/stores/game'

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

    const res = WORLD_MAP_RES.get(event.worldPlaceKey)

    if (!core.useEnergy(res.costEnergy)) {
      throw new Error(`角色${event.uid}体力不足${res.costEnergy}点`)
    }

    // 创建历练房间
    const room = this.world.createEntity()
    room.addComponent(WorldLilianRoom, event.uid, event.worldPlaceKey)
    // 历练中的收获的暂存区
    room.addComponent(StuffBox, { items: [] })

    core.currentEvent = {
      type: 'li_lian',
      data: {},
    }
  }

  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const room = entity.getComponent(WorldLilianRoom)!

      if (room.isTimeFull) {
        // 时间已满，应当进入历练结算流程
      }

      room.addTimeCount(1)

      const worldBlockRes = WORLD_MAP_RES.get(room.mapKey)
      // 随机抽取历练事件
      const eventIndex = weightedRandom(worldBlockRes.events)
      const selectedEvent = worldBlockRes.events[eventIndex]
      switch (selectedEvent.type) {
        case 'stuff_collect':
          this.onSelectStuffCollect(entity, worldBlockRes)
          break
        case 'meet_enemy':
        case 'empty':
        /* 暂无实现 */
      }

      if (room.roomOwnerUid === 'p1') this.refreshView(entity)
    })
  }

  /**
   * 进行历练的收集物品事件
   * @param e
   * @param res
   */
  private onSelectStuffCollect(e: Entity, res: Readonly<WorldMapResources>) {
    // 按稀有度权重随机抽取一个物品
    const itemIndex = weightedRandom(res.stuffItems)
    const selectedItem = res.stuffItems[itemIndex]
    // 随机生成数量，1到maxCount之间
    const count = Math.floor(Math.random() * selectedItem.maxCount) + 1
    // 加入暂存区
    const stuffBox = e.getComponent(StuffBox)!
    stuffBox.addItem(selectedItem.key, count)
    // 生成文本
    const stuffRes = STUFF_RES.get(selectedItem.key)
    const text = `拾取了${count}个${stuffRes.name}`
    const room = e.getComponent(WorldLilianRoom)!
    room.msg.push(text)
  }

  /**
   * 刷新视图状态数据
   * @param e
   */
  private refreshView(e: Entity) {
    const gameStore = useGameStore()
    const room = e.getComponent(WorldLilianRoom)!
    gameStore.lilianInfo = {
      mapKey: room.mapKey,
      timeCount: room.timeCount,
      messages: [...room.msg],
    }
  }
}
