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
    public readonly data: PlayerCoreData,
  ) {
    super()
  }

  get exp() {
    return this.data.exp
  }

  get lv() {
    return this.data.lv
  }

  get name() {
    return this.data.name
  }

  get gongfa(): Readonly<PlayerGongfaData | undefined> {
    return this.data.gongfa
  }

  get currentEvent(): Readonly<PlayerEventData> {
    return this.data.currentEvent
  }

  set currentEvent(event: PlayerEventData) {
    this.data.currentEvent = event
  }

  /**
   * 境界等级
   */
  get realmLv(): number {
    /* 每20lv一个境界 */
    return Math.floor(this.lv / 20)
  }

  resetCurrentEvent() {
    this.data.currentEvent = {
      type: 'none',
      data: {},
    }
  }

  addExp(val: number) {
    this.data.exp += val
  }

  /**
   * 是否有功法
   */
  hasGongfa(): boolean {
    return !!this.gongfa
  }

  updataGongfa(duration: number, data: GongfaPerData) {
    if (!this.gongfa) return
    this.data.gongfa = {
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
    this.data.gongfa = {
      key,
      duration: 0,
      data: {},
    }
  }

  /**
   * 计算升级到下一级所需的经验值
   * @param baseExp 基础经验值，默认为100
   * @param growthCurve 增长曲线，默认为1.5
   * @returns 升级到下一级所需的经验值
   */
  nextLevelExp(baseExp: number = 100, growthCurve: number = 1.5): number {
    let exp1 = baseExp * Math.pow(this.lv, growthCurve)
    // 添加线性调整因子避免低等级跳跃过大
    exp1 += baseExp * this.lv * 0.5
    return Math.round(exp1)
  }
}

/**
 * 玩家控制的角色
 */
export class P1 extends Component {}
