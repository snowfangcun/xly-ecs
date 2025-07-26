/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, System } from '@/framework'
import { PlayerBagAddItemEvent } from '../events/PlayerEvents'
import { StuffBox } from '../stuff/StuffComp'
import { PlayerCore } from './PlayerComp'

export class PlayerBagSystem extends System {
  private addQueue: { key: string; count: number; data?: any }[] = []

  constructor() {
    super({ all: [PlayerCore, StuffBox] })
    this.eventSubscribe(PlayerBagAddItemEvent, this.onPlayerBagAddItem.bind(this))
  }

  private onPlayerBagAddItem(event: PlayerBagAddItemEvent) {
    this.addQueue.push({
      key: event.key,
      count: event.count,
      data: event.data,
    })
  }

  update(entities: Entity[]): void {
    entities.forEach((e) => {
      const bag = e.getComponent(StuffBox)
      if (!bag) return
      // 处理物品添加
      this.addQueue.forEach((i) => bag.addItem(i.key, i.count, i.data))
    })
  }
}
