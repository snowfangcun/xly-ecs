/* eslint-disable @typescript-eslint/no-explicit-any */
export type StuffType = 'gongfa' | 'ling_plant' | 'other'

export type BaseStuffResources = {
  name: string
  type: StuffType
  desc: string
  /* 物品等阶，共9阶 */
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
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
  triggerFnKey: string
}

/**
 * buff资源类型
 */
export type BuffResources = {
  name: string
  /**
   * buff的参数配置
   */
  args: Record<string, any>
  desc: () => string
  isValid: (data: BuffData) => boolean
  /**
   * buff持久化的初始数据
   */
  initData: () => Record<string, any>
  /**
   * 效果触发器函数资源的key
   */
  triggerFnKey: string
  merge(oldData: Record<string, any>, newData: Record<string, any>): Record<string, any>
}

/**
 * 灵药资源类型
 */
export type LingPlantResources = BaseStuffResources & {
  isStackable: true
  lingAttr: LingAttr
  type: 'ling_plant'
}

export type WorldLilianEvent = 'stuff_collect' | 'meet_enemy'

/**
 * 世界地点资源类型
 * 世界地点指代一个世界中的地域
 */
export type WorldPlaceResources = {
  name: string
  desc: string
  /* 当地产物可探索获得 */
  stuffItems: {
    key: string
    /* 稀有度 */
    rarity: number
    /* 最大可获得数量 */
    maxCount: number
  }[]
  events: {
    type: WorldLilianEvent
    rarity: number
  }[]
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
  buffs: Map<string, BuffData>
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

export type LingAttr = 'metal' | 'wood' | 'water' | 'fire' | 'soil'

/**
 * 灵根
 * 灵根上限100点，这100点会随机分布在各个属性上。
 * 某个属性较突出，则代表为外在表象。
 * 灵根对角色的属性有着各项增幅
 * 单个增益：金：爆发伤害；木：少防御，高恢复；水：中气血，中恢复；火：持续伤害；土：防御
 * 复合增益：火木：炼丹；火金：炼器；木土：种植；
 */
export type LingRoot = { [key in LingAttr]: number }

/**
 * 角色状态属性
 */
export type StateProps = {
  hp: number
  mp: number
  shenshi: number
  energy: number
}
