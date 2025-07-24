import { Entity, type EntityId } from './entity'
export class World {
  private _entities: Map<EntityId, Entity> = new Map()

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
}
