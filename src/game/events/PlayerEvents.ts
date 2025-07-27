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

/**
 * 角色背包使用物品事件
 */
export class PlayerBagUseItemEvent extends Event {
  /**
   * 使用物品
   * @param uuid 物品唯一标识符
   * @param key 物品资源key
   * @param option 使用选项
   */
  constructor(
    public readonly uuid: string,
    public readonly key: string,
    public readonly option: string,
  ) {
    super()
  }
}

/**
 * 角色开始修练事件
 */
export class PlayerStartXiulian extends Event {
  constructor(public readonly uid: string = 'p1') {
    super()
  }
}

/**
 * 角色结束修练事件
 */
export class PlayerFinishXiulian extends Event {
  constructor(public readonly uid: string = 'p1') {
    super()
  }
}
