import { Component } from '@/framework'
import type { WorldMapResources } from '../base/Types'
import { WORLD_MAP_RES } from '../base/ResCenter'

export class WorldComp extends Component {
  constructor(
    public readonly key: string,
    public readonly resources: WorldMapResources,
  ) {
    super()
  }
}

export class WorldLilianRoom extends Component {
  /** 房间id */
  public readonly roomId = crypto.randomUUID()

  /* 历练经过的时间 */
  private _timeCount = 0

  public msg: string[] = []

  constructor(
    /* 房间创建者 */
    public readonly roomOwnerUid: string,
    /* 房间所属世界地点 */
    public readonly mapKey: string,
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
    const res = WORLD_MAP_RES.get(this.mapKey)
    return this.timeCount >= res.maxTime
  }

  addTimeCount(val: number) {
    this._timeCount += val
  }
}
