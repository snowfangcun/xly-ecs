import { Component } from '@/framework'
import type { PlayerCoreData, PlayerGongfaData } from '../base/Types'

/**
 * 角色核心组件
 */
export class PlayerCore extends Component {
  constructor(private _data: PlayerCoreData) {
    super()
  }

  get exp() {
    return this._data.exp
  }

  get lv() {
    return this._data.lv
  }

  get name() {
    return this._data.name
  }

  get gongfa(): Readonly<PlayerGongfaData | undefined> {
    return this._data.gongfa
  }

  addExp(val: number) {
    this._data.exp += val
    console.log('addExp', val, this._data.exp)
  }
}

/**
 * 玩家控制的角色
 */
export class P1 extends Component {}
