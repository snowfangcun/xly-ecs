import type { Component } from './Component'
import type { ComponentConstructor, ComponentType } from './Types'

export type EntityId = string

export class Entity {
  private readonly _components = new Map<ComponentConstructor, Component>()

  constructor(readonly id: string) {}

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
  }

  getComponent<T extends Component>(compType: ComponentType<T>): T | undefined {
    return this._components.get(compType) as T
  }
}
