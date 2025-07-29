import { Entity, System } from '@/framework'
import { PlayerCore, PlayerEffectCache } from './PlayerComp'
import { BUFF_RES, BUFF_TRIGGER_RES } from '../base/ResCenter'
import type { Effect } from './Effect'
import { PlayerAddBuffEvent } from '../events/PlayerEvents'
import { queryPlayerByUid } from '../query/Query'

/**
 * 玩家buff处理系统
 */
export class PlayerBuffHandlerSystem extends System {
  constructor() {
    super({
      all: [PlayerCore],
    })
  }

  onAddedToWorld(): void {
    this.eventSubscribe(PlayerAddBuffEvent, this.onPlayerAddBuff.bind(this))
  }

  private onPlayerAddBuff(event: PlayerAddBuffEvent) {
    const { uid, buffKey } = event
    const [player] = this.world!.query(queryPlayerByUid(uid))
    const playerCore = player.getComponent(PlayerCore)!
    const buffResources = BUFF_RES.get(buffKey)
    const initData = buffResources.initData()
    // 如果存在老buff数据，则需要对buff数据进行合并
    const oldData = playerCore.getBuff(buffKey)
    if (oldData) {
      playerCore.addBuff(buffKey, buffResources.merge(oldData, initData))
    } else {
      playerCore.addBuff(buffKey, initData)
    }
  }

  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const core = entity.getComponent(PlayerCore)!
      const effectCache = entity.getComponent(PlayerEffectCache)!

      let effect2: Effect[] = []

      // 遍历effct
      effectCache.effects.forEach((effect) => {
        // 遍历buff
        for (const [k, v] of core.data.buffs.entries()) {
          const buffRes = BUFF_RES.get(k)
          if (!buffRes.isValid(v)) return
          const buffTrigger = BUFF_TRIGGER_RES.get(buffRes.triggerFnKey)
          const { data, effects } = buffTrigger(buffRes.args, v, effect)
          core.data.buffs.set(k, data)
          effect2 = [...effect2, ...effects]
          // 再次验证buff，失效则删除
          if (!buffRes.isValid(data)) core.removeBuff(k)
        }
      })
    })
  }
}
