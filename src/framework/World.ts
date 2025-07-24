/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs'
import { Entity, type EntityId } from './entity'
import type { System } from './system'
import type { Event } from './Event'

export class World {
  private _entities: Map<EntityId, Entity> = new Map()
  private readonly _systems: System[] = []
  /* 暂停 */
  private _paused = false
  private eventSubject = new Subject<Event>()
  public readonly event$ = this.eventSubject.asObservable()

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

  /**
   * 通过系统类型获取系统
   * @param systemType
   * @returns
   */
  getSystem<T extends System>(systemType: new (...args: any[]) => T): T | undefined {
    return this._systems.find((system) => system instanceof systemType) as T | undefined
  }

  /**
   * 世界循环更新函数
   * @param deltaTime
   */
  async update(deltaTime: number): Promise<void> {
    /* 如果世界为暂停状态则不更新 */
    if (this._paused) return
    /* 筛选出启用的系统 */
    const enabledSystems = this._systems.filter((system) => system.enabled)
    const promises = enabledSystems.map((s) => {
      this.executeSystemUpdate(s, deltaTime)
    })
    await Promise.all(promises)
  }

  private async executeSystemUpdate(system: System, deltaTime: number): Promise<void> {
    const queryEntities = Array.from(this._entities.values())
    system.update(queryEntities, deltaTime)
  }

  emitEvent(event: Event) {
    this.eventSubject.next(event)
  }
}
