/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Event } from './Event'
import type { System } from './System'
import type { ComponentType } from './Types'
import type { World } from './World'

/**
 * 插件接口
 */
export interface Plugin {
  /**
   * 插件安装时调用
   * @param world 插件被安装到的世界
   */
  onInstall?(world: World): void

  /**
   * 插件卸载时调用
   * @param world 插件被卸载的世界
   */
  onUninstall?(world: World): void

  /**
   * 在世界更新前调用
   * @param deltaTime 距离上一帧的间隔时间
   */
  preUpdate?(deltaTime: number): void

  /**
   * 在世界更新后调用
   * @param deltaTime 距离上一帧的间隔时间
   */
  postUpdate?(deltaTime: number): void

  /**
   * 在系统添加到世界时调用
   * @param system 被添加的系统
   */
  onSystemAdded?(system: System): void

  /**
   * 在系统从世界移除时调用
   * @param system 被移除的系统
   */
  onSystemRemoved?(system: System): void

  /**
   * 在实体创建时调用
   * @param entityId 实体ID
   */
  onEntityCreated?(entityId: string): void

  /**
   * 在实体移除时调用
   * @param entityId 实体ID
   */
  onEntityRemoved?(entityId: string): void

  /**
   * 在组件添加到实体时调用
   * @param entityId 实体ID
   * @param componentType 组件类型
   */
  onComponentAdded?(entityId: string, componentType: ComponentType): void

  /**
   * 在组件从实体移除时调用
   * @param entityId 实体ID
   * @param componentType 组件类型
   */
  onComponentRemoved?(entityId: string, componentType: ComponentType): void

  /**
   * 在事件派发时调用
   * @param event 被派发的事件
   */
  onEventDispatched?(event: Event): void
}

export type PluginType<T extends Plugin = Plugin> = new (...args: any[]) => T

/**
 * 插件管理器类，用于管理和安装插件
 */
export class PluginManager {
  private readonly plugins: Map<PluginType, Plugin> = new Map()
  constructor(private readonly world: World) {}

  /**
   * 安装插件
   * @param pluginType 插件类型
   * @param args 插件构造函数的参数
   */
  install<T extends Plugin, P extends PluginType<T>>(
    pluginType: P,
    ...args: ConstructorParameters<P>
  ) {
    const plugin = new pluginType(...args)
    // 检查是否已安装
    if (this.plugins.has(pluginType)) {
      throw new Error(`插件 ${pluginType.name} 已经安装`)
    }
    this.plugins.set(pluginType, plugin)
    // 调用插件的安装钩子
    plugin.onInstall?.(this.world)
  }

  /**
   * 卸载插件
   * @param pluginType 插件类型
   */
  uninstall<T extends Plugin>(pluginType: PluginType<T>) {
    const plugin = this.plugins.get(pluginType)
    if (!plugin) {
      throw new Error(`插件 ${pluginType.name} 未安装`)
    }
    // 调用插件的卸载钩子
    plugin.onUninstall?.(this.world)
    this.plugins.delete(pluginType)
  }

  /**
   * 调用所有插件的preUpdate钩子
   * @param deltaTime 距离上一帧的间隔时间
   */
  preUpdate(deltaTime: number): void {
    for (const plugin of this.plugins.values()) {
      plugin.preUpdate?.(deltaTime)
    }
  }

  /**
   * 调用所有插件的postUpdate钩子
   * @param deltaTime 距离上一帧的间隔时间
   */
  postUpdate(deltaTime: number): void {
    for (const plugin of this.plugins.values()) {
      plugin.postUpdate?.(deltaTime)
    }
  }

  /**
   * 调用所有插件的onSystemAdded钩子
   * @param system 被添加的系统
   */
  onSystemAdded(system: System): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSystemAdded?.(system)
    }
  }

  /**
   * 调用所有插件的onSystemRemoved钩子
   * @param system 被移除的系统
   */
  onSystemRemoved(system: System): void {
    for (const plugin of this.plugins.values()) {
      plugin.onSystemRemoved?.(system)
    }
  }

  /**
   * 调用所有插件的onEntityCreated钩子
   * @param entityId 实体ID
   */
  onEntityCreated(entityId: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.onEntityCreated?.(entityId)
    }
  }

  /**
   * 调用所有插件的onEntityRemoved钩子
   * @param entityId 实体ID
   */
  onEntityRemoved(entityId: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.onEntityRemoved?.(entityId)
    }
  }

  /**
   * 调用所有插件的onComponentAdded钩子
   * @param entityId 实体ID
   * @param componentType 组件类型
   */
  onComponentAdded(entityId: string, componentType: ComponentType): void {
    for (const plugin of this.plugins.values()) {
      plugin.onComponentAdded?.(entityId, componentType)
    }
  }

  /**
   * 调用所有插件的onComponentRemoved钩子
   * @param entityId 实体ID
   * @param componentType 组件类型
   */
  onComponentRemoved(entityId: string, componentType: ComponentType): void {
    for (const plugin of this.plugins.values()) {
      plugin.onComponentRemoved?.(entityId, componentType)
    }
  }

  /**
   * 调用所有插件的onEventDispatched钩子
   * @param event 被派发的事件
   */
  onEventDispatched(event: Event): void {
    for (const plugin of this.plugins.values()) {
      plugin.onEventDispatched?.(event)
    }
  }
}
