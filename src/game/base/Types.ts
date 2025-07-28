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

export type PlayerCoreData = {
  name: string
  lv: number
  exp: number
  gongfa?: PlayerGongfaData
  currentEvent: PlayerEventData
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
  /* 闪避 */
  dodge: number
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
 */
export type LingRoot = {
  /* 金：伤害 */
  metal: number
  /* 木：防御 */
  wood: number
  /* 水：气血 */
  water: number
  /*  */
  fire: number
  /* 土：防御 */
  soil: number
}
