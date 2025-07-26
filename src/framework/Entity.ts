import type { Component } from './Component'
import {
  ComponentAddedEvent,
  ComponentRemovedEvent,
  EntityAddTagEvent,
  type EventDispatcher,
} from './Event'
import type { PluginManager } from './Plugin'
import type { ComponentConstructor, ComponentType } from './Types'

/**
 * 实体ID类型
 */
export type EntityId = string

/**
 * 组件会用到的实体接口
 */
export interface IComponent4Entity {
  get id(): EntityId
  getComponent<T extends Component>(componentType: ComponentType<T>): T | undefined
}

/**
 * 实体类，代表游戏世界中的一个实体
 */
export class Entity implements IComponent4Entity {
  private readonly _components = new Map<ComponentConstructor, Component>()
  private _tags: Set<string>

  constructor(
    readonly id: string,
    private readonly eventDispatcher: EventDispatcher,
    private readonly pluginManager: PluginManager,
    tags: string[] = [],
  ) {
    this._tags = new Set(tags)
  }

  get componentTypes(): ComponentConstructor[] {
    return Array.from(this._components.keys())
  }

  get tags(): Set<string> {
    return new Set(this._tags)
  }

  /**
   * 添加标签
   * @param tag
   */
  addTag(tag: string): void {
    this._tags.add(tag)
    this.eventDispatcher.emitEvent(new EntityAddTagEvent(this.id, tag))
  }

  /**
   * 移除标签
   * @param tag
   */
  removeTag(tag: string): void {
    this._tags.delete(tag)
    this.eventDispatcher.emitEvent(new EntityAddTagEvent(this.id, tag))
  }

  /**
   * 检查实体是否有指定标签
   * @param tag
   * @returns
   */
  hasTag(tag: string): boolean {
    return this._tags.has(tag)
  }

  /**
   * 向实体添加组件
   * @param comp
   * @param args
   * @returns
   */
  addComponent<T extends Component, P extends ComponentType<T>>(
    comp: P,
    ...args: ConstructorParameters<P>
  ): T {
    const component = new comp(...args)
    this._components.set(comp, component)
    component.owner = this
    component.eventDispatcher = this.eventDispatcher
    component.onAdded?.()
    // 派发组件添加事件
    this.eventDispatcher?.emitEvent(new ComponentAddedEvent(this.id, comp))
    // 调用插件钩子
    this.pluginManager?.onComponentAdded(this.id, comp)
    return component
  }

  /**
   * 从实体中移除组件
   * @param comp
   * @returns
   */
  removeComponent<T extends Component>(comp: ComponentType<T>): void {
    const component = this._components.get(comp)
    if (!component) return
    component.onRemoved?.()
    this._components.delete(comp)
    component.owner = undefined
    component.eventDispatcher = undefined
    // 派发组件移除事件
    this.eventDispatcher?.emitEvent(new ComponentRemovedEvent(this.id, comp))
    // 调用插件钩子
    this.pluginManager?.onComponentRemoved(this.id, comp)
  }

  getComponent<T extends Component>(compType: ComponentType<T>): T | undefined {
    return this._components.get(compType) as T
  }
}
