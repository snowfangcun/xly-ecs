import { World } from '@/framework'
import { P1, PlayerCore } from './player/PlayerComp'
import { GongfaSystem } from './player/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'
import { ViewDataRefreshSystem } from './player/ViewDataRefreshSystem'

export function startGame() {
  const world = new World()

  const playerEntity = world.createEntity()
  playerEntity.addComponent(P1)
  playerEntity.addComponent(PlayerCore, {
    name: '韩立',
    lv: 1,
    exp: 0,
  })
  playerEntity.addComponent(StuffBox, { items: [] })

  world.addSystem(GongfaSystem)
  world.addSystem(ViewDataRefreshSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}
