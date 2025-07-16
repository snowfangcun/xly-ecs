import { Core, Scene } from '@esengine/ecs-framework'
import { createPlayerEntity } from './player/Player'
import { PlayerXiulianSys } from './player/XiulianSystem'

export const core = Core.create(true)

export function startGame() {
  const scene = new Scene()
  Core.scene = scene

  scene.addEntityProcessor(new PlayerXiulianSys())

  createPlayerEntity(scene, '韩立')

  // 启动定时器
  setInterval(() => {
    Core.update(2)
  }, 1000)
}
