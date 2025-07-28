import { World } from '@/framework'
import { P1, PlayerCore } from './player/PlayerComp'
import { GongfaSystem } from './player/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'
import { ViewDataRefreshSystem } from './player/ViewDataRefreshSystem'
import { PlayerBagSystem } from './player/PlayerBagSystem'
import { DebugPlugin } from './plugins/DebugPlugin'
import { PlayerEffectHandlerSystem } from './player/PlayerEffectHandlerSystem'

let world: World

export function startGame() {
  if (world) return
  world = new World()

  /* 安装插件 */
  world.installPlugin(DebugPlugin, { name: 'DebugPlugin', description: '调试插件' })

  const playerEntity = world.createEntity()
  playerEntity.addComponent(P1)
  playerEntity.addComponent(PlayerCore, 'p1', {
    name: '韩立',
    lv: 1,
    exp: 0,
    currentEvent: {
      type: 'none',
      data: {},
    },
    lingRoot:{
      metal: 0,
      wood: 0,
      water: 0,
      fire: 0,
      soil: 0
    },
    state:{
      hp:0,
      mp:0,
      energy:0,
      shenshi:0,
    },
    growAttr:{
      lingPower: 0,
      shenShi: 0,
      tiPo: 0,
      xinJing: 0
    }
  })
  playerEntity.addComponent(StuffBox, { items: [] })

  world.addSystem(GongfaSystem)
  world.addSystem(PlayerBagSystem)
  world.addSystem(ViewDataRefreshSystem)
  world.addSystem(PlayerEffectHandlerSystem, 10)

  setInterval(() => {
    world.update(1)
  }, 1000)
}

export function getWorld() {
  return world
}
