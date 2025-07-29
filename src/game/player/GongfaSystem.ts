import { Entity, System } from '@/framework'
import { gongfaResourcesLoader, gongfaTriggerResourcesLoader } from '../base/ResCenter'
import { PlayerFinishXiulianEvent, PlayerStartXiulianEvent } from '../events/PlayerEvents'
import { queryPlayerByUid } from '../query/Query'
import { PlayerCore, PlayerEffectCache } from './PlayerComp'

/**
 * 角色功法系统
 */
export class GongfaSystem extends System {
  constructor() {
    super({ all: [PlayerCore] })
  }

  onAddedToWorld(): void {
    this.eventSubscribe(PlayerStartXiulianEvent, this.onPlayerStartXiulian.bind(this))
    this.eventSubscribe(PlayerFinishXiulianEvent, this.onPlayerFinishXiulian.bind(this))
  }

  /**
   * 开始修炼事件
   * @param event
   */
  private onPlayerStartXiulian(event: PlayerStartXiulianEvent): void {
    const [player] = this.world!.query(queryPlayerByUid(event.uid))

    if (!player) throw new Error(`角色${event.uid}不存在`)

    const core = player.getComponent(PlayerCore)!

    if (!core.hasGongfa()) throw new Error(`角色${event.uid}没有功法`)

    if (core.currentEvent.type === 'none') {
      core.currentEvent = {
        type: 'xiu_lian',
        data: {},
      }
    } else {
      throw new Error(`角色${event.uid}正在进行其他事件: ${core.currentEvent.type}`)
    }
  }

  /**
   * 结束修炼事件
   * @param event
   */
  private onPlayerFinishXiulian(event: PlayerFinishXiulianEvent): void {
    const [player] = this.world!.query(queryPlayerByUid(event.uid))

    if (!player) throw new Error(`角色${event.uid}不存在`)

    const core = player.getComponent(PlayerCore)!

    if (core.currentEvent.type !== 'xiu_lian') throw new Error(`角色${event.uid}没有进行修炼`)

    core.resetCurrentEvent()
  }

  update(entities: Entity[]): void {
    entities.forEach((e) => {
      const core = e.getComponent(PlayerCore)!
      const effectCache = e.getComponent(PlayerEffectCache)!

      if (core.currentEvent.type !== 'xiu_lian') return

      const gfData = core.gongfa!

      const res = gongfaResourcesLoader.get(gfData.key)
      const gongfaTrigger = gongfaTriggerResourcesLoader.get(res.triggerFnKey)

      const { data, effects, duration } = gongfaTrigger(
        core.uid,
        res.args,
        gfData.duration,
        gfData.data || {},
      )

      // 更新功法数据
      core.updataGongfa(duration, data)

      // 派发功法效果
      effects.forEach((effect) => {
        effectCache.addEffect(effect)
      })
    })
  }
}
