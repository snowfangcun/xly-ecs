import { Entity, System } from '@/framework'
import { GONGFA_RES } from '../base/ResCenter'
import type { StuffItem } from '../base/Types'
import {
  PlayerBagAddItemEvent,
  PlayerBagRemoveItemEvent,
  PlayerBagUseItemEvent,
} from '../events/PlayerEvents'
import { queryP1 } from '../query/Query'
import { StuffBox } from '../stuff/StuffComp'
import { PlayerCore } from '../comp/PlayerComp'

export class PlayerBagSystem extends System {
  constructor() {
    super({ all: [PlayerCore, StuffBox] })
  }

  onAddedToWorld(): void {
    this.eventSubscribe(PlayerBagAddItemEvent, this.onPlayerBagAddItem.bind(this))
    this.eventSubscribe(PlayerBagRemoveItemEvent, this.onPlayerBagRemoveItem.bind(this))
    this.eventSubscribe(PlayerBagUseItemEvent, this.onPlayerBagUseItem.bind(this))
  }

  /**
   * 角色背包添加物品事件
   * @param event
   */
  private onPlayerBagAddItem(event: PlayerBagAddItemEvent) {
    const [p1] = this.world!.query(queryP1)
    const bag = p1.getComponent(StuffBox)!
    bag.addItem(event.key, event.count, event.data)
  }

  /**
   * 角色背包移除物品事件
   * @param event
   */
  private onPlayerBagRemoveItem(event: PlayerBagRemoveItemEvent) {
    const [p1] = this.world!.query(queryP1)
    const bag = p1.getComponent(StuffBox)!
    bag.removeItem(event.uuid, event.count)
  }

  /**
   * 角色背包使用物品事件
   * @param event
   */
  private onPlayerBagUseItem(event: PlayerBagUseItemEvent) {
    const [p1] = this.world!.query(queryP1)
    const bag = p1.getComponent(StuffBox)!
    const item = bag.getItem(event.uuid)
    switch (event.option) {
      case 'learn':
        this.learnGongfa(p1, item)
        break
    }
  }

  /**
   * 修习功法
   * @param p1
   * @param item
   * @returns
   */
  private learnGongfa(p1: Entity, item: StuffItem) {
    if (!GONGFA_RES.has(item.key)) {
      throw new Error(`功法资源不存在: ${item.key}`)
    }
    const bag = p1.getComponent(StuffBox)!
    if (!bag.isCanRemoveItem(item.uuid, 1)) {
      throw new Error(`背包中没有足够的物品: ${item.key}`)
    }
    const playerCore = p1.getComponent(PlayerCore)!
    if (playerCore.hasGongfa()) {
      throw new Error('已修习过功法')
    }
    playerCore.learnGongfa(item.key)
    // 消费物品
    bag.removeItem(item.uuid, 1)
  }

  update(): void {}
}
