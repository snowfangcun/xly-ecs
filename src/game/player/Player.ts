import { Component, Entity, Scene } from '@esengine/ecs-framework'
import { PlayerEffectComp } from './effect/Effect'
import { PlayerBuffComp } from './buff/Buff'

/**
 * 角色核心组件
 */
export class PlayerCoreComp extends Component {
  constructor(
    public name: string,
    public lv: number,
    public exp: number,
    /* 主功法数据 */
    public mainGongfa: readonly [key: string, data: object] | null,
  ) {
    super()
  }

  addExp(exp: number) {
    this.exp += exp
    console.log(`${this.name} 获得 ${exp} 经验`)
  }
}

/**
 * 创建玩家实体
 * @param scene
 * @param name
 */
export function createPlayerEntity(scene: Scene, name: string): Entity {
  const entity = scene.createEntity('player')
  entity.addComponent(new PlayerCoreComp(name, 1, 0, null))
  entity.addComponent(new PlayerEffectComp())
  entity.addComponent(new PlayerBuffComp([['juqi', { count: 1 }]]))
  return entity
}
