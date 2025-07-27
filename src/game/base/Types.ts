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
