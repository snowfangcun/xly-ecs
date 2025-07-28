/* eslint-disable @typescript-eslint/no-explicit-any */
export type StuffType = 'gongfa' | 'other'

export type BaseStuffResources = {
  name: string
  type: StuffType
  desc: string
  isStackable: boolean
  useOptions: readonly string[]
}

/* 功法持久化数据类型 */
export type GongfaPerData = Record<string, any>

/**
 * 功法资源数据类型
 */
export type GongfaResources = BaseStuffResources & {
  type: 'gongfa'
  isStackable: false
  args: Record<string, any>
  effectStr: () => string
}

export type BuffResources = {
  name: string
  /**
   * buff的参数配置
   */
  args: Record<string, any>
  desc: () => string
  isValid: () => boolean
  /**
   * buff持久化的初始数据
   */
  initData: () => Record<string, any>
  /**
   * 效果触发器函数资源的key
   */
  triggerFnKey: string
}

/**
 * 角色功法数据
 */
export type PlayerGongfaData = {
  /** 功法资源key */
  key: string
  /** 功法修习的时长 */
  duration: number
  /** 功法数据 */
  data?: GongfaPerData
}

/**
 * 角色历练事件
 */
export type PlayerEventType = 'none' | 'xiu_lian' | 'li_lian'

export type PlayerEventData = {
  type: PlayerEventType
  data: Record<string, any>
}

export type BuffData = Record<string, any>

export type PlayerCoreData = {
  name: string
  lv: number
  exp: number
  gongfa?: PlayerGongfaData
  currentEvent: PlayerEventData
  growAttr: PlayerGrowAttr
  lingRoot: LingRoot
  state: StateProps
  buffs: BuffData[]
}

/**
 * 物品item数据
 */
export type StuffItem = {
  uuid: string
  key: string
  count: number
  data?: any
}

/**
 * 物品容器数据
 */
export type StuffBoxData = {
  items: StuffItem[]
}

export type MetaAttr = {
  hpMax: number
  mpMax: number
  atk: number
  def: number
  spd: number
  /* 命中 */
  hit: number
}

export type PlayerGrowAttr = {
  /**
   * 灵力
   * 角色实力最直接的来源，提供伤害，蓝条
   */
  lingPower: number
  /**
   * 神识
   * 提供命中率，精神类法术蓝条，精神抗性
   */
  shenShi: number

  /**
   * 体魄
   * 提供角色生命值，和防御值
   */
  tiPo: number

  /**
   * 心境
   * 1，影响修炼效率
   * 2，影响战斗效率：命中率下降，闪避下降，法术效果波动
   */
  xinJing: number
}

/**
 * 灵根
 * 灵根上限100点，这100点会随机分布在各个属性上。
 * 某个属性较突出，则代表为外在表象。
 * 灵根对角色的属性有着各项增幅
 * 复合增益：火木：炼丹；火金：炼器；木土：种植；
 */
export type LingRoot = {
  /* 金：爆发伤害 */
  metal: number
  /* 木：少防御，高恢复 */
  wood: number
  /* 水：中气血，中恢复 */
  water: number
  /* 火：持续伤害 */
  fire: number
  /* 土：防御 */
  soil: number
}

/**
 * 角色状态属性
 */
export type StateProps = {
  hp: number
  mp: number
  shenshi: number
  energy: number
}
