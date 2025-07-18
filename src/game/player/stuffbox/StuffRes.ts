/* eslint-disable @typescript-eslint/no-explicit-any */
import { GongfaChangChunGong, type BaseGongfa } from '../gongfa/Gongfa'

type StuffType = 'gongfa' | 'danyao'

export type BaseStuffRes = {
  name: string
  type: StuffType
  isStackable: boolean
  desc: string
}

export type GongfaStuffRes = BaseStuffRes & {
  clz: new (data: any | null) => BaseGongfa<any>
}

function defGongfaRes(res: Omit<GongfaStuffRes, 'type' | 'isStackable'>): GongfaStuffRes {
  return {
    ...res,
    type: 'gongfa',
    isStackable: false,
  }
}

export const StuffResTable: Record<string, BaseStuffRes> = {
  chang_chun_gong: defGongfaRes({
    name: '长春功',
    desc: '长春功',
    clz: GongfaChangChunGong,
  }),
}

/**
 * 获取物品资源
 * @param id
 * @returns
 */
export function getStuffRes(id: string): BaseStuffRes {
  if (!StuffResTable[id]) throw new Error(`没有找到物品${id}`)
  return StuffResTable[id]
}

/**
 * 获取功法资源
 * @param id
 * @returns
 */
export function getGongfaRes(id: string): GongfaStuffRes {
  const res = getStuffRes(id)
  if (res.type !== 'gongfa') throw new Error(`物品${id}不是功法`)
  return res as GongfaStuffRes
}
