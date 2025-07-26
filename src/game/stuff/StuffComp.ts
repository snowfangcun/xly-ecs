/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@/framework'
import type { StuffBoxData } from '../base/Types'
import { stuffResourcesLoader } from '../base/ResCenter'

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
      this.addNew(key, count, data)
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
}
