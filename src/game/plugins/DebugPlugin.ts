import { Plugin, type Event, type PluginContext, type World } from '@/framework'
import { PlayerBagAddItemEvent } from '../events/PlayerEvents'
import { stuffResourcesLoader } from '../base/ResCenter'

export class DebugPlugin extends Plugin {
  private world: World = null!
  private context: PluginContext = null!

  onInstall(world: World, context: PluginContext) {
    this.world = world
    this.context = context
  }

  onEventDispatched(event: Event): void {
    if (event instanceof PlayerBagAddItemEvent) {
      const res = stuffResourcesLoader.get(event.key)
      this.print(`角色背包增加物品: ${res.name}, 数量: ${event.count}`)
    }
  }
}
