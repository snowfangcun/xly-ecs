import type { Event, Plugin, PluginContext, World } from '@/framework'
import { PlayerBagAddItemEvent } from '../events/PlayerEvents'
import { stuffResourcesLoader } from '../base/ResCenter'

export class DebugPlugin implements Plugin {
  private world: World = null!
  private context: PluginContext = null!

  onInstall(world: World, context: PluginContext) {
    this.world = world
    this.context = context
  }

  onEventDispatched(event: Event): void {
    if (event instanceof PlayerBagAddItemEvent) {
      const res = stuffResourcesLoader.get(event.key)
      console.log(`[角色储物]增加物品: ${res.name}, 数量: ${event.count}`)
    }
  }
}
