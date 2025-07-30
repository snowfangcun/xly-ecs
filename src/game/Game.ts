import { World } from '@/framework'
import { P1, PlayerCore, PlayerEffectCache } from './comp/PlayerComp'
import { GongfaSystem } from './sys/GongfaSystem'
import { StuffBox } from './stuff/StuffComp'
import { ViewDataRefreshSystem } from './sys/ViewDataRefreshSystem'
import { PlayerBagSystem } from './sys/PlayerBagSystem'
import { DebugPlugin } from './plugins/DebugPlugin'
import { PlayerEffectHandlerSystem } from './sys/PlayerEffectHandlerSystem'
import { PlayerMetaAttrComp } from './comp/PlayerMetaAttrComp'
import { PlayerBuffHandlerSystem } from './sys/PlayerBuffHandlerSystem'
import { WORLD_MAP_RES } from './base/ResCenter'
import { WorldComp } from './comp/WorldComp'
import { PlayerLilianSystem } from './sys/PlayerLilianSystem'

let world: World

export function startGame() {
  if (world) return
  world = new World()

  /* 安装插件 */
  world.installPlugin(DebugPlugin, { name: 'DebugPlugin', description: '调试插件' })

  loadWorldPlace(world)

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
    buffs: new Map(),
  })
  playerEntity.addComponent(StuffBox, { items: [] })
  playerEntity.addComponent(PlayerMetaAttrComp)
  playerEntity.addComponent(PlayerEffectCache, [])

  world.addSystem(GongfaSystem, 20)
  //buff处理的优先级要比effect处理高
  world.addSystem(PlayerBuffHandlerSystem, 11)
  world.addSystem(PlayerBagSystem)
  world.addSystem(PlayerLilianSystem)
  world.addSystem(PlayerEffectHandlerSystem, 10)
  world.addSystem(ViewDataRefreshSystem)

  setInterval(() => {
    world.update(1)
  }, 1000)
}

/**
 * 加载世界地点实体
 * @param world
 */
function loadWorldPlace(world: World) {
  WORLD_MAP_RES.getAllKeys().forEach((key) => {
    const worldPlace = world.createEntity(['world_place'])
    const res = WORLD_MAP_RES.get(key)
    worldPlace.addComponent(WorldComp, key, res)
  })
}

export function getWorld() {
  return world
}
