
import type { Component } from './component'

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 组件构造函数类型
 */
export type ComponentConstructor<T extends Component = Component> = new (...args: any[]) => T

/**
 * 组件类型
 */
export type ComponentType<T extends Component = Component> = ComponentConstructor<T>


/**
 * 特定组件类型的存储
 */
export interface ComponentStorage {
  /** 组件构造函数 */
  componentType: ComponentType;
  /** 组件的密集数组 */
  components: Component[];
}

