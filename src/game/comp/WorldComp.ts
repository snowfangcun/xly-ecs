import { Component } from '@/framework'
import type { WorldPlaceResources } from '../base/Types'

export class WorldComp extends Component {
  constructor(
    public readonly key: string,
    public readonly resources: WorldPlaceResources,
  ) {
    super()
  }
}

export class WorldLilianRoom extends Component {
  /** 房间id */
  public readonly roomId = crypto.randomUUID()
  constructor(
    /* 房间创建者 */
    public readonly roomOwner: string,
    /* 房间所属世界地点 */
    public readonly worldPlaceKey: string,
  ) {
    super()
  }
}
