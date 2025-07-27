/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, System } from '@/framework'
import {
  PlayerBagAddItemEvent,
  PlayerBagRemoveItemEvent,
  PlayerBagUseItemEvent,
} from '../events/PlayerEvents'
import { queryP1 } from '../query/Query'
import { StuffBox } from '../stuff/StuffComp'
import { PlayerCore } from './PlayerComp'
import type { StuffItem } from '../base/Types'
import { gongfaResourcesLoader } from '../base/ResCenter'

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

  private learnGongfa(p1: Entity, item: StuffItem) {
    const gongfaRes = gongfaResourcesLoader.get(item.key)
    const playerCore = p1.getComponent(PlayerCore)!
  }

  update(): void {}
}
