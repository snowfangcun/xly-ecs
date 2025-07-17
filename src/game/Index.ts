import { Core, Scene } from '@esengine/ecs-framework'
import { createPlayerEntity } from './player/Player'
import { GongfaSys } from './player/gongfa/GongfaSys'
import { BuffSys } from './player/buff/BuffSys'
import { EffectSys } from './player/effect/EffectSys'

export const core = Core.create(true)

export function startGame() {
  const scene = new Scene()
  Core.scene = scene

  scene.addEntityProcessor(new GongfaSys()).updateOrder = 1
  scene.addEntityProcessor(new BuffSys()).updateOrder = 10
  scene.addEntityProcessor(new EffectSys()).updateOrder = 20

  createPlayerEntity(scene, '韩立')

  // 启动定时器
  setInterval(() => {
    Core.update(2)
  }, 1000)
}
