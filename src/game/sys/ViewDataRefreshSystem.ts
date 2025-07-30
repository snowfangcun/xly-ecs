import { Entity, System } from '@/framework'
import { P1, PlayerCore } from '../comp/PlayerComp'
import { useGameStore } from '@/stores/game'
import { StuffBox } from '../stuff/StuffComp'
import { PlayerMetaAttrComp } from '../comp/PlayerMetaAttrComp'

export class ViewDataRefreshSystem extends System {
  private readonly gameStore = useGameStore()

  constructor() {
    super({
      all: [P1, PlayerCore],
    })
  }

  update(entities: Entity[]): void {
    const entity = entities[0]
    const core = entity.getComponent(PlayerCore)!
    const metaAttr = entity.getComponent(PlayerMetaAttrComp)!
    const bag = entity.getComponent(StuffBox)!
    this.gameStore.name = core.name
    this.gameStore.exp = core.exp
    this.gameStore.expMax = core.nextLevelExp()
    this.gameStore.lv = core.lv
    this.gameStore.bag = { ...bag.data }
    this.gameStore.state = { ...core.data.state }
    this.gameStore.metaAttr = { ...metaAttr.metaAttr }
    if (core.gongfa) this.gameStore.gongfa = { ...core.gongfa }
    this.gameStore.currentEvent = { ...core.currentEvent }

    /* 刷新历练 */
    


  }
}
