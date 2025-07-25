import type { Component } from './Component'
import type { Event } from './Event'
import type { System } from './System'

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
 * 事件构造函数类型
 */
export type EventType<T extends Event> = new (...args: any[]) => T

export type SystemType<T extends System = System> = new () => T
