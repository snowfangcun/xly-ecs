/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity } from './Entity'
import {
  EntityQuery,
  QueryCriteriaBuilder,
  type QueryCriteria,
  type QueryCriteriaReadonly,
} from './EntityQuery'
import {
  EntityCreatedEvent,
  EntityRemovedEvent,
  EventDispatcher,
  EventDispatchMode,
  SystemAddedEvent,
  SystemRemovedEvent,
  type Event,
} from './Event'
import { PluginManager, type Plugin, type PluginMetadata, type PluginType } from './Plugin'
import type { System } from './System'
import type { SystemType } from './Types'

export class World {
  private readonly _systems: {
    system: System
    systemType: SystemType
  }[] = []
  /* 暂停 */
  private _paused = false
  private readonly eventDispatcher = new EventDispatcher()
  public readonly event$ = this.eventDispatcher.event$
  private entityQuery: EntityQuery = new EntityQuery(this.eventDispatcher)
  // 添加插件管理器
  private readonly pluginManager: PluginManager = new PluginManager(this)

  /**
   * 创建实体
   * @returns
   */
  createEntity(tags: string[] = []): Entity {
    const entity = new Entity(crypto.randomUUID(), this.eventDispatcher, this.pluginManager, tags)
    this.entityQuery.addEntity(entity)
    /* 派发实体创建事件，此事件会延迟到帧末尾派发 */
    this.eventDispatcher.emitEvent(new EntityCreatedEvent(entity.id), EventDispatchMode.EndOfFrame)
    // 调用插件钩子
    this.pluginManager.onEntityCreated(entity.id)
    return entity
  }

  /**
   * 移除实体
   * @param entityInstance
   */
  removeEntity(entityInstance: Entity): void {
    this.entityQuery.removeEntity(entityInstance)
    /* 派发实体移除事件，此事件会延迟到帧末尾派发 */
    this.eventDispatcher.emitEvent(
      new EntityRemovedEvent(entityInstance.id),
      EventDispatchMode.EndOfFrame,
    )
    // 调用插件钩子
    this.pluginManager.onEntityRemoved(entityInstance.id)
  }

  /**
   * 向世界中添加系统
   */
  addSystem<T extends System>(systemType: SystemType<T>, priority: number = 1): this {
    const systemInstance = new systemType()
    systemInstance.priority = priority
    systemInstance.world = this
    this._systems.push({
      system: systemInstance,
      systemType,
    })
    /* 按照系统的优先级进行排序 */
    this._systems.sort((a, b) => b.system.priority - a.system.priority)
    /* 调用系统的onAddedToWorld生命周期方法 */
    systemInstance.onAddedToWorld()
    /* 派发系统添加事件，此事件会延迟到帧末尾派发 */
    this.eventDispatcher.emitEvent(new SystemAddedEvent(systemType), EventDispatchMode.EndOfFrame)
    // 调用插件钩子
    this.pluginManager.onSystemAdded(systemInstance)
    return this
  }

  /**
   * 从世界中移除系统
   * @param systemType
   * @returns
   */
  removeSystem(systemType: SystemType): this {
    const index = this._systems.findIndex((s) => s.systemType === systemType)
    if (index !== -1) {
      const s = this._systems[index]
      this._systems.splice(index, 1)
      /* 调用系统的onRemovedFromWorld生命周期方法 */
      s.system.onRemovedFromWorld()
      /* 派发系统移除事件，此事件会延迟到帧末尾派发 */
      this.eventDispatcher.emitEvent(
        new SystemRemovedEvent(s.systemType),
        EventDispatchMode.EndOfFrame,
      )
      // 调用插件钩子
      this.pluginManager.onSystemRemoved(s.system)
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

    // 调用插件预更新钩子
    this.pluginManager.preUpdate(deltaTime)

    /* 筛选出启用的系统 */
    const enabledSystems = this._systems.filter((s) => s.system.enabled)
    const promises = enabledSystems.map((s) => {
      this.executeSystemFrameUpdate(s.system, deltaTime)
    })
    await Promise.all(promises)

    // 调用插件后更新钩子
    this.pluginManager.postUpdate(deltaTime)

    // 处理帧结束事件
    this.eventDispatcher.processFrameEndEvents()
  }

  /**
   * 执行系统帧更新
   * @param system
   * @param deltaTime
   */
  private async executeSystemFrameUpdate(system: System, deltaTime: number): Promise<void> {
    const queryEntities = this.query(system.queryCriteriaBuilder)
    system.preUpdate?.(deltaTime)
    system.update(queryEntities, deltaTime)
    system.postUpdate?.(deltaTime)
  }

  query(criteria: QueryCriteriaBuilder | QueryCriteria | QueryCriteriaReadonly): Entity[] {
    return this.entityQuery.query(criteria)
  }

  /**
   * 派发事件
   * @param event 要派发的事件
   * @param mode 事件处理模式，默认为即时处理
   */
  emitEvent(event: Event, mode: EventDispatchMode = EventDispatchMode.Immediate): void {
    this.eventDispatcher.emitEvent(event, mode)
    // 调用插件钩子
    this.pluginManager.onEventDispatched(event)
  }

  /**
   * 安装插件
   * @param pluginType 插件类型
   * @param args 插件构造函数的参数
   */
  installPlugin<T extends Plugin, P extends PluginType<T>>(
    pluginType: P,
    metadata: PluginMetadata,
    ...args: ConstructorParameters<P>
  ) {
    this.pluginManager.install(pluginType, metadata, ...args)
  }

  /**
   * 卸载插件
   * @param pluginType 插件类型
   */
  uninstall<T extends Plugin>(pluginType: PluginType<T>) {
    this.pluginManager.uninstall(pluginType)
  }
}
