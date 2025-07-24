import { Entity, type EntityId } from './entity'
import type { System } from './system'
export class World {
  private _entities: Map<EntityId, Entity> = new Map()
  private readonly _systems: System[] = []

  /**
   * 创建实体
   * @returns
   */
  createEntity(): Entity {
    const entity = new Entity(crypto.randomUUID())
    this._entities.set(entity.id, entity)
    return entity
  }

  /**
   * 移除实体
   * @param entityInstance
   */
  removeEntity(entityInstance: Entity): void {
    this._entities.delete(entityInstance.id)
  }

  /**
   * 根据实体ID移除实体
   * @param entityId
   */
  removeEntityById(entityId: EntityId): void {
    this._entities.delete(entityId)
  }

  /**
   * 向世界中添加系统
   */
  addSystem(system: System): this {
    this._systems.push(system)
    /* 按照系统的优先级进行排序 */
    this._systems.sort((a, b) => b.priority - a.priority)
    /* 调用系统的onAddedToWorld生命周期方法 */
    system.onAddedToWorld(this)
    return this
  }

  /**
   * 从世界中移除系统
   * @param system
   * @returns
   */
  removeSystem(system: System): this {
    const index = this._systems.indexOf(system)
    if (index !== -1) {
      this._systems.splice(index, 1)
      /* 调用系统的onRemovedFromWorld生命周期方法 */
      system.onRemovedFromWorld()
    }
    return this
  }
}
