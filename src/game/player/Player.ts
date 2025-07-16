import { Component, Entity, Scene } from '@esengine/ecs-framework'

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
}

/**
 * 创建玩家实体
 * @param scene
 * @param name
 */
export function createPlayerEntity(scene: Scene, name: string): Entity {
  const entity = scene.createEntity('player')
  entity.addComponent(new PlayerCoreComp(name, 1, 0))
  return entity
}
