import { Component } from '@/framework'
import type {
  GongfaPerData,
  PlayerCoreData,
  PlayerEventData,
  PlayerGongfaData,
} from '../base/Types'

/**
 * 角色核心组件
 */
export class PlayerCore extends Component {
  constructor(
    public readonly uid: string,
    private _data: PlayerCoreData,
  ) {
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

  get currentEvent(): Readonly<PlayerEventData> {
    return this._data.currentEvent
  }

  set currentEvent(event: PlayerEventData) {
    this._data.currentEvent = event
  }

  resetCurrentEvent() {
    this._data.currentEvent = {
      type: 'none',
      data: {},
    }
  }

  addExp(val: number) {
    this._data.exp += val
  }

  /**
   * 是否有功法
   */
  hasGongfa(): boolean {
    return !!this.gongfa
  }

  updataGongfa(duration: number, data: GongfaPerData) {
    if (!this.gongfa) return
    this._data.gongfa = {
      ...this.gongfa,
      duration: duration,
      data: data,
    }
  }

  /**
   * 修习功法
   * @param key
   */
  learnGongfa(key: string) {
    this._data.gongfa = {
      key,
      duration: 0,
      data: {},
    }
  }
}

/**
 * 玩家控制的角色
 */
export class P1 extends Component {}
