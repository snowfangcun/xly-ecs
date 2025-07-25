/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity } from './Entity'
import { EntityQuery, QueryCriteriaBuilder, type QueryCriteria } from './EntityQuery'
import { EventDispatcher, EventDispatchMode, type Event } from './Event'
import type { System } from './System'

export class World {
  private readonly _systems: System[] = []
  /* 暂停 */
  private _paused = false
  private eventDispatcher = new EventDispatcher()
  public readonly event$ = this.eventDispatcher.event$
  private entityQuery: EntityQuery = new EntityQuery(this.eventDispatcher)

  /**
   * 创建实体
   * @returns
   */
  createEntity(): Entity {
    const entity = new Entity(crypto.randomUUID(), this.eventDispatcher)
    this.entityQuery.addEntity(entity)
    return entity
  }

  /**
   * 移除实体
   * @param entityInstance
   */
  removeEntity(entityInstance: Entity): void {
    this.entityQuery.removeEntity(entityInstance)
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
      this.executeSystemFrameUpdate(s, deltaTime)
    })
    await Promise.all(promises)

    // 处理帧结束事件
    this.eventDispatcher.processFrameEndEvents()
  }

  /**
   * 执行系统帧更新
   * @param system
   * @param deltaTime
   */
  private async executeSystemFrameUpdate(system: System, deltaTime: number): Promise<void> {
    const queryEntities = this.query(system.requiredComponents)
    system.preUpdate?.(deltaTime)
    system.update(queryEntities, deltaTime)
    system.postUpdate?.(deltaTime)
  }

  query(criteria: QueryCriteriaBuilder | QueryCriteria): Entity[] {
    return this.entityQuery.query(criteria)
  }

  /**
   * 派发事件
   * @param event 要派发的事件
   * @param mode 事件处理模式，默认为即时处理
   */
  emitEvent(event: Event, mode: EventDispatchMode = EventDispatchMode.Immediate): void {
    this.eventDispatcher.emitEvent(event, mode)
  }
}
