import { Component, Entity, Scene } from '@esengine/ecs-framework'
import { PlayerEffectComp } from './Effect'

/**
 * 角色核心组件
 */
export class PlayerCoreComp extends Component {
  constructor(
    public name: string,
    public lv: number,
    public exp: number,
  ) {
    super()
  }

  addExp(exp: number) {
    this.exp += exp
  }
}

/**
 * 创建玩家实体
 * @param scene
 * @param name
 */
export function createPlayerEntity(scene: Scene, name: string): Entity {
  const entity = scene.createEntity('player')
  entity.addComponent(new PlayerCoreComp(name, 1, 0)).updateOrder = 1
  entity.addComponent(new PlayerEffectComp()).updateOrder = 10
  return entity
}
