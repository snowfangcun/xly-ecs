import { World } from '@/framework'
import { P1, PlayerCore } from './player/PlayerComp'
import { GongfaSystem } from './player/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'
import { ViewDataRefreshSystem } from './player/ViewDataRefreshSystem'
import { PlayerBagSystem } from './player/PlayerBagSystem'
import { DebugPlugin } from './plugins/DebugPlugin'

let world: World

export function startGame() {
  if (world) return
  world = new World()

  /* 安装插件 */
  world.installPlugin(DebugPlugin, { name: 'DebugPlugin', description: '调试插件' })

  const playerEntity = world.createEntity()
  playerEntity.addComponent(P1)
  playerEntity.addComponent(PlayerCore, {
    name: '韩立',
    lv: 1,
    exp: 0,
  })
  playerEntity.addComponent(StuffBox, { items: [] })

  world.addSystem(GongfaSystem)
  world.addSystem(PlayerBagSystem)
  world.addSystem(ViewDataRefreshSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}

export function getWorld() {
  return world
}
