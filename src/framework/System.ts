import type { World } from './world'

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
}
