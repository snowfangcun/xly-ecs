import { World } from '@/framework'
import { PlayerCore } from './player/PlayerComp'
import { GongfaSystem } from './player/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'

export function startGame() {
  const world = new World()

  const playerEntity = world.createEntity()
  playerEntity.addComponent(PlayerCore, {
    name: '韩立',
    lv: 1,
    exp: 0,
  })
  playerEntity.addComponent(StuffBox, { items: [] })

  world.addSystem(GongfaSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}
