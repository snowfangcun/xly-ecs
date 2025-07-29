import { Entity, System } from '@/framework'
import { PlayerCore, PlayerEffectCache } from './PlayerComp'
import { buffResourcesLoader, buffTriggerResourcesLoader } from '../base/ResCenter'
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
    const buffResources = buffResourcesLoader.get(buffKey)
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
        core.data.buffs.forEach((v, k) => {
          const buffRes = buffResourcesLoader.get(k)
          if (!buffRes.isValid(v)) return
          const buffTrigger = buffTriggerResourcesLoader.get(buffRes.triggerFnKey)
          const { data, effects } = buffTrigger(buffRes.args, v, effect)
          core.data.buffs.set(k, data)
          effect2 = [...effect2, ...effects]
        })
      })

      // 清理失效buff
      core.data.buffs = new Map(
        [...core.data.buffs].filter(([k, v]) => {
          const buffRes = buffResourcesLoader.get(k)
          return buffRes.isValid(v)
        }),
      )
    })
  }
}
