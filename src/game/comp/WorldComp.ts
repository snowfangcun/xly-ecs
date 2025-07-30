import { Component } from '@/framework'
import type { WorldPlaceResources } from '../base/Types'
import { WORLD_PLACE_RES } from '../base/ResCenter'

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

  /* 历练经过的时间 */
  private _timeCount = 0

  constructor(
    /* 房间创建者 */
    public readonly roomOwnerUid: string,
    /* 房间所属世界地点 */
    public readonly worldPlaceKey: string,
  ) {
    super()
  }

  get timeCount() {
    return this._timeCount
  }

  /**
   * 是否达到了最大历练时间
   */
  get isTimeFull(): boolean {
    const res = WORLD_PLACE_RES.get(this.worldPlaceKey)
    return this.timeCount >= res.maxTime
  }

  addTimeCount(val: number) {
    this._timeCount += val
  }
}
