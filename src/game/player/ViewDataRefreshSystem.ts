import { Entity, System } from '@/framework'
import { P1, PlayerCore } from './PlayerComp'
import { useGameStore } from '@/stores/game'
import { StuffBox } from '../stuff/StuffComp'

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
    const bag = entity.getComponent(StuffBox)!
    this.gameStore.name = core.name
    this.gameStore.exp = core.exp
    this.gameStore.lv = core.lv
    this.gameStore.bag = bag.data
  }
}
