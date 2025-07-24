import { filter, map } from 'rxjs'
import type { EventType } from './Types'
import type { World } from './world'
import type { Entity } from './entity'

/**
 * 所有系统的基类
 */
export abstract class System {
  private _enabled = true
  private _priority = 0
  protected world: World | undefined = undefined
  /**
   * Get system enabled state
   */
  get enabled(): boolean {
    return this._enabled
  }

  /**
   * 设置系统启用状态
   */
  set enabled(value: boolean) {
    this._enabled = value
  }

  /**
   * 获取系统优先级（较高值先执行）
   */
  get priority(): number {
    return this._priority
  }

  /**
   * 设置系统优先级
   */
  set priority(value: number) {
    this._priority = value
  }

  /**
   * 系统添加到世界时调用
   * @param world 系统被添加到的世界实例
   */
  onAddedToWorld(world: World): void {
    this.world = world
  }

  /**
   * 系统从世界移除时调用
   */
  onRemovedFromWorld(): void {
    this.world = undefined
  }

  /**
   * 订阅事件
   * @param eventType
   * @param callback
   */
  eventSubscribe<T extends Event>(eventType: EventType<T>, callback: (event: T) => void): void {
    this.world?.event$
      .pipe(
        filter((event) => event instanceof eventType),
        map((event) => event as T),
      )
      .subscribe((event) => callback(event))
  }

  /**
   * 派发事件
   * @param event
   */
  eventDispatch(event: Event): void {
    this.world?.emitEvent(event)
  }

  /**
   * 更新前调用
   * @param deltaTime
   */
  preUpdate?(deltaTime: number): void

  /**
   * 使用匹配的实体更新系统
   * @param entities
   * @param deltaTime
   */
  abstract update(entities: Entity[], deltaTime: number): void

  /**
   * 更新后调用
   * @param deltaTime
   */
  postUpdate?(deltaTime: number): void
}
