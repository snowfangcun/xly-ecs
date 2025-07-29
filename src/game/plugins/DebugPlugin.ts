import { Plugin, type Event, type PluginContext, type World } from '@/framework'
import { BUFF_RES, STUFF_RES } from '../base/ResCenter'
import {
  PlayerAddBuffEvent,
  PlayerBagAddItemEvent,
  PlayerBagUseItemEvent,
} from '../events/PlayerEvents'

export class DebugPlugin extends Plugin {
  private world: World = null!
  private context: PluginContext = null!

  onInstall(world: World, context: PluginContext) {
    this.world = world
    this.context = context
  }

  onEventDispatched(event: Event): void {
    if (event instanceof PlayerBagAddItemEvent) {
      const res = STUFF_RES.get(event.key)
      this.print(`角色背包增加物品: ${res.name}, 数量: ${event.count}`)
    } else if (event instanceof PlayerBagUseItemEvent) {
      const res = STUFF_RES.get(event.key)
      this.print(`角色背包使用物品: ${res.name}, 选项: ${event.option}`)
    } else if (event instanceof PlayerAddBuffEvent) {
      const buffres = BUFF_RES.get(event.buffKey)
      this.print(`角色(${event.uid})添加buff: ${buffres.name}`)
    }
  }
}
