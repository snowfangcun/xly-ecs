/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@/framework'
import type { StuffBoxData } from '../base/Types'
import { stuffResourcesLoader } from '../base/ResCenter'
import { times } from 'lodash'

export class StuffBox extends Component {
  constructor(private _data: StuffBoxData) {
    super()
  }

  get data() {
    return this._data
  }

  /**
   * 添加物品
   * @param key
   * @param count
   * @param data
   */
  addItem(key: string, count: number, data?: any) {
    const res = stuffResourcesLoader.get(key)
    if (!res.isStackable) {
      // 当不可堆叠时候，重复添加count次1个物品
      times(count, () => {
        this.addNew(key, 1, data)
      })
    } else {
      this.addOver(key, count, data)
    }
  }

  /**
   * 添加新物品
   * @param key
   * @param count
   * @param data
   */
  private addNew(key: string, count: number, data?: any) {
    this._data.items.push({
      uuid: crypto.randomUUID(),
      key,
      count,
      data,
    })
  }

  /**
   * 物品叠加
   * @param key
   * @param count
   */
  private addOver(key: string, count: number, data?: any) {
    const item = this._data.items.find((i) => i.key === key)
    if (item) {
      item.count += count
    } else {
      this.addNew(key, count, data)
    }
  }

  /**
   * 移除物品
   * @param uuid
   * @param count
   */
  removeItem(uuid: string, count: number) {
    const item = this._data.items.find((i) => i.uuid === uuid)
    if (item && item.count >= count) {
      item.count -= count
      if (item.count === 0) {
        this._data.items.splice(this._data.items.indexOf(item), 1)
      }
    }
  }

  /**
   * 获取物品
   * @param uuid
   * @returns
   */
  getItem(uuid: string) {
    const item = this._data.items.find((i) => i.uuid === uuid)
    if (!item) {
      throw new Error(`Item with uuid ${uuid} not found`)
    }
    return item
  }
}
