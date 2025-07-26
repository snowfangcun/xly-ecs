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
   * @param context 插件上下文，用于在插件之间共享数据
   */
  onInstall?(world: World, context: PluginContext): void

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
   * 在实体添加标签时调用
   * @param entityId 实体ID
   * @param tag 标签
   */
  onEntityAddTag?(entityId: string, tag: string): void

  /**
   * 在实体移除标签时调用
   * @param entityId 实体ID
   * @param tag 标签
   */
  onEntityRemoveTag?(entityId: string, tag: string): void

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

export interface PluginMetadata {
  /**
   * 插件名称
   */
  name: string

  /**
   * 插件版本
   */
  version?: string

  /**
   * 插件描述
   */
  description?: string

  /**
   * 插件优先级，数值越高优先级越高
   */
  priority?: number

  /**
   * 依赖的插件列表
   */
  dependencies?: string[]
}

/**
 * 插件上下文接口，用于在插件之间共享数据
 */
export interface PluginContext {
  /**
   * 设置上下文数据
   * @param key 数据键名
   * @param value 数据值
   */
  set<T>(key: string, value: T): void

  /**
   * 获取上下文数据
   * @param key 数据键名
   * @returns 数据值
   */
  get<T>(key: string): T | undefined

  /**
   * 删除上下文数据
   * @param key 数据键名
   * @returns 是否删除成功
   */
  delete(key: string): boolean

  /**
   * 检查是否存在指定键名的数据
   * @param key 数据键名
   * @returns 是否存在
   */
  has(key: string): boolean

  /**
   * 清空所有上下文数据
   */
  clear(): void
}

/**
 * 插件上下文实现类
 */
class PluginContextImpl implements PluginContext {
  private readonly data: Map<string, any> = new Map()

  set<T>(key: string, value: T): void {
    this.data.set(key, value)
  }

  get<T>(key: string): T | undefined {
    return this.data.get(key)
  }

  delete(key: string): boolean {
    return this.data.delete(key)
  }

  has(key: string): boolean {
    return this.data.has(key)
  }

  clear(): void {
    this.data.clear()
  }
}

/**
 * 插件管理器类，用于管理和安装插件
 */
export class PluginManager {
  private readonly plugins: Map<PluginType, Plugin> = new Map()
  private readonly pluginMetadata: Map<PluginType, PluginMetadata> = new Map()
  private readonly context: PluginContext = new PluginContextImpl()

  constructor(private readonly world: World) {}

  /**
   * 获取插件上下文
   */
  getContext(): PluginContext {
    return this.context
  }

  /**
   * 安装插件
   * @param pluginType 插件类型
   * @param args 插件构造函数的参数
   */
  install<T extends Plugin, P extends PluginType<T>>(
    pluginType: P,
    metadata: PluginMetadata,
    ...args: ConstructorParameters<P>
  ) {
    // 检查依赖
    if (metadata?.dependencies) {
      for (const depName of metadata.dependencies) {
        let found = false
        for (const [type] of this.plugins) {
          const pluginMeta = this.pluginMetadata.get(type)
          if (pluginMeta?.name === depName) {
            found = true
            break
          }
        }
        if (!found) {
          throw new Error(`插件 ${metadata.name} 依赖于插件 ${depName}，但该插件未安装`)
        }
      }
    }

    // 检查是否已安装
    if (this.plugins.has(pluginType)) {
      throw new Error(`插件 ${pluginType.name} 已经安装`)
    }

    const plugin = new pluginType(...args)
    this.pluginMetadata.set(pluginType, metadata)

    this.plugins.set(pluginType, plugin)

    // 按优先级排序
    this.sortPluginsByPriority()

    // 调用插件的安装钩子
    plugin.onInstall?.(this.world, this.context)
  }

  /**
   * 按优先级排序插件
   */
  private sortPluginsByPriority(): void {
    // 获取所有插件及其元数据
    const pluginsWithMeta = Array.from(this.plugins.entries()).map(([type, plugin]) => {
      const meta = this.pluginMetadata.get(type)
      return { type, plugin, priority: meta?.priority ?? 0 }
    })

    // 按优先级降序排序
    pluginsWithMeta.sort((a, b) => b.priority - a.priority)

    // 重新插入Map以保证遍历顺序
    this.plugins.clear()
    for (const { type, plugin } of pluginsWithMeta) {
      this.plugins.set(type, plugin)
    }
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

    // 检查是否有其他插件依赖于该插件
    const pluginMeta = this.pluginMetadata.get(pluginType)
    if (pluginMeta?.name) {
      for (const [type] of this.plugins) {
        // 跳过正在卸载的插件本身
        if (type === pluginType) continue

        const otherPluginMeta = this.pluginMetadata.get(type)
        if (otherPluginMeta?.dependencies?.includes(pluginMeta.name)) {
          throw new Error(
            `无法卸载插件 ${pluginMeta.name}，因为插件 ${otherPluginMeta.name} 依赖于它`,
          )
        }
      }
    }

    // 调用插件的卸载钩子
    plugin.onUninstall?.(this.world)
    this.plugins.delete(pluginType)
    this.pluginMetadata.delete(pluginType)
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
   * 调用所有插件的onEntityAddTag钩子
   * @param entityId 实体ID
   * @param tag 标签
   */
  onEntityAddTag(entityId: string, tag: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.onEntityAddTag?.(entityId, tag)
    }
  }

  /**
   * 调用所有插件的onEntityRemoveTag钩子
   * @param entityId 实体ID
   * @param tag 标签
   */
  onEntityRemoveTag(entityId: string, tag: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.onEntityRemoveTag?.(entityId, tag)
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
