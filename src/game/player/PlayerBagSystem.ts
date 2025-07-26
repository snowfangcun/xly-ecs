import { Entity, System } from '@/framework'
import { PlayerCore } from './PlayerComp'
import { StuffBox } from '../stuff/StuffComp'

export class PlayerBagSystem extends System {
  constructor() {
    super({ all: [PlayerCore, StuffBox] })
  }

  update(entities: Entity[], deltaTime: number): void {
    throw new Error('Method not implemented.')
  }
}
