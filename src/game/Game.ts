import { World } from '@/framework'
import { P1, PlayerCore, PlayerEffectCache } from './player/PlayerComp'
import { GongfaSystem } from './player/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'
import { ViewDataRefreshSystem } from './player/ViewDataRefreshSystem'
import { PlayerBagSystem } from './player/PlayerBagSystem'
import { DebugPlugin } from './plugins/DebugPlugin'
import { PlayerEffectHandlerSystem } from './player/PlayerEffectHandlerSystem'
import { PlayerMetaAttrComp } from './player/PlayerMetaAttrComp'
import { PlayerBuffHandlerSystem } from './player/PlayerBuffHandlerSystem'

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
    lingRoot: {
      metal: 0,
      wood: 0,
      water: 0,
      fire: 0,
      soil: 0,
    },
    state: {
      hp: 0,
      mp: 0,
      energy: 0,
      shenshi: 0,
    },
    growAttr: {
      lingPower: 0,
      shenShi: 0,
      tiPo: 0,
      xinJing: 0,
    },
    buffs: [],
  })
  playerEntity.addComponent(StuffBox, { items: [] })
  playerEntity.addComponent(PlayerMetaAttrComp)
  playerEntity.addComponent(PlayerEffectCache, [])

  world.addSystem(GongfaSystem, 20)
  //buff处理的优先级要比effect处理高
  world.addSystem(PlayerBuffHandlerSystem, 11)
  world.addSystem(PlayerBagSystem)
  world.addSystem(PlayerEffectHandlerSystem, 10)
  world.addSystem(ViewDataRefreshSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}

export function getWorld() {
  return world
}
