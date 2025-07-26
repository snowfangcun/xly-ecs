import { Entity, System } from '@/framework'
import { PlayerCore } from './PlayerComp'

/**
 * 角色功法系统
 */
export class GongfaSystem extends System {
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
