import { Entity, System } from '@/framework'
import { PlayerCore } from './PlayerComp'

export class XiulianSystem extends System {
  constructor() {
    super({ all: [PlayerCore] })
  }
  update(entities: Entity[]): void {
    entities.forEach((e) => {
      const core = e.getComponent(PlayerCore)
      core?.addExp(1)
    })
  }
}
