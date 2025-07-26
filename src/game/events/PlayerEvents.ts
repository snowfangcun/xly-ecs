/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from '@/framework'

/**
 * 角色背包添加物品事件
 */
export class PlayerBagAddItemEvent extends Event {
  constructor(
    public readonly key: string,
    public readonly count: number,
    public readonly data: any = undefined,
  ) {
    super()
  }
}

/**
 * 角色背包移除物品事件
 */
export class PlayerBagRemoveItemEvent extends Event {
  constructor(
    public readonly uuid: string,
    public readonly count: number,
  ) {
    super()
  }
}
