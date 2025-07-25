import { World } from '@/framework'
import { PlayerCore } from './player/PlayerComp'
import { XiulianSystem } from './player/XiulianSystem'

export function startGame() {
  const world = new World()

  const playerEntity = world.createEntity()
  playerEntity.addComponent(PlayerCore, '韩立', 0, 1)

  world.addSystem(XiulianSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}
