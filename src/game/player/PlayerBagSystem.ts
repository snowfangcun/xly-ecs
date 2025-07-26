/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, System } from '@/framework'
import { PlayerBagAddItemEvent, PlayerBagRemoveItemEvent } from '../events/PlayerEvents'
import { StuffBox } from '../stuff/StuffComp'
import { PlayerCore } from './PlayerComp'

export class PlayerBagSystem extends System {
  private addQueue: { key: string; count: number; data?: any }[] = []
  private removeQueue: { uuid: string; count: number }[] = []

  constructor() {
    super({ all: [PlayerCore, StuffBox] })
  }

  onAddedToWorld(): void {
    this.eventSubscribe(PlayerBagAddItemEvent, this.onPlayerBagAddItem.bind(this))
    this.eventSubscribe(PlayerBagRemoveItemEvent, this.onPlayerBagRemoveItem.bind(this))
  }

  private onPlayerBagAddItem(event: PlayerBagAddItemEvent) {
    this.addQueue.push({
      key: event.key,
      count: event.count,
      data: event.data,
    })
  }

  private onPlayerBagRemoveItem(event: PlayerBagRemoveItemEvent) {
    this.removeQueue.push({
      uuid: event.uuid,
      count: event.count,
    })
  }

  update(entities: Entity[]): void {
    entities.forEach((e) => {
      const bag = e.getComponent(StuffBox)
      if (!bag) return
      // 处理物品添加
      this.addQueue.forEach((i) => bag.addItem(i.key, i.count, i.data))
      // 处理物品移除
      this.removeQueue.forEach((i) => bag.removeItem(i.uuid, i.count))
    })
    this.addQueue = []
    this.removeQueue = []
  }
}
