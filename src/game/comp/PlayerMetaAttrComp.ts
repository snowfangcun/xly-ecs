import { Component } from '@/framework'
import type { MetaAttr } from '../base/Types'
import { PlayerCore } from './PlayerComp'

export class PlayerMetaAttrComp extends Component {
  get metaAttr(): MetaAttr {
    const meta: Partial<MetaAttr> = {}
    const core = this.owner!.getComponent(PlayerCore)!
    meta.hpMax = this.getHpMax(core)
    meta.atk = this.getAtk(core)
    meta.def = this.getDef(core)
    meta.mpMax = this.getMpMax(core)
    meta.spd = 0
    meta.hit = 0
    return meta as MetaAttr
  }

  getHpMax(core: PlayerCore): number {
    const basicHp = [100, 300, 1000, 3000, 10000][core.lv]
    // 体魄属性对hp的换算：体魄值*乘数
    const lingPowerFactor = core.data.growAttr.lingPower * 8
    const relamFactor = this.getRelamGrowFactor(core.realmLv)
    return Math.floor(
      basicHp * (1 + relamFactor) ** core.lv + lingPowerFactor * (1 + relamFactor) ** core.lv,
    )
  }

  getMpMax(core: PlayerCore): number {
    const basicMp = [50, 150, 500, 1500, 5000][core.lv]
    // 体魄属性对mp的换算：体魄值*乘数
    const tiPoFactor = core.data.growAttr.tiPo * 0.5
    const relamFactor = this.getRelamGrowFactor(core.realmLv)
    return Math.floor(
      basicMp * (1 + relamFactor) ** core.lv + tiPoFactor * (1 + relamFactor) ** core.lv,
    )
  }

  getAtk(core: PlayerCore): number {
    const basicAtk = [20, 100, 200, 500, 1000][core.lv]
    const lingPowerFactor = core.data.growAttr.lingPower * 5
    const relamFactor = this.getRelamGrowFactor(core.realmLv)
    return Math.floor(
      basicAtk * (1 + relamFactor) ** core.lv + lingPowerFactor * (1 + relamFactor) ** core.lv,
    )
  }

  getDef(core: PlayerCore): number {
    const basicDef = [10, 80, 100, 200, 500][core.lv]
    const tiPoFactor = core.data.growAttr.tiPo * 5
    const relamFactor = this.getRelamGrowFactor(core.realmLv)
    return Math.floor(
      basicDef * (1 + relamFactor) ** core.lv + tiPoFactor * (1 + relamFactor) ** core.lv,
    )
  }

  /**
   * 获取境界成长系数
   * @param relam
   * @returns
   */
  private getRelamGrowFactor(relam: number) {
    const factor: readonly number[] = [0.15, 0.18, 0.2, 0.22, 0.24]
    return factor[relam]
  }
}
