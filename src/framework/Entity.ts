import type { Component } from './Component'
import { ComponentAddedEvent, ComponentRemovedEvent, type EventDispatcher } from './Event'
import type { ComponentConstructor, ComponentType } from './Types'

export type EntityId = string

export class Entity {
  private readonly _components = new Map<ComponentConstructor, Component>()

  constructor(
    readonly id: string,
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  get componentTypes(): ComponentConstructor[] {
    return Array.from(this._components.keys())
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
    component.onAdded?.()
    // 派发组件添加事件
    this.eventDispatcher?.emitEvent(new ComponentAddedEvent(this.id, comp))
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
    // 派发组件移除事件
    this.eventDispatcher?.emitEvent(new ComponentRemovedEvent(this.id, comp))
  }

  getComponent<T extends Component>(compType: ComponentType<T>): T | undefined {
    return this._components.get(compType) as T
  }
}
