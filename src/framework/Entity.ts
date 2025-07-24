import type { Component } from './component'
import type { ComponentConstructor } from './Types'

export type EntityId = string

export class Entity {
  private readonly _components = new Map<ComponentConstructor, Component>()

  constructor(readonly id: string) {}

  /**
   * 向实体添加组件
   * @param comp
   * @param args
   * @returns
   */
  addComponent<T extends Component>(
    comp: ComponentConstructor<T>,
    ...args: ConstructorParameters<ComponentConstructor<T>>
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
  removeComponent<T extends Component>(comp: ComponentConstructor<T>): void {
    const component = this._components.get(comp)
    if (!component) return
    component.onRemoved?.()
    this._components.delete(comp)
  }
}
