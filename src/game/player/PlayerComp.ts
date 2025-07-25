import { Component } from '@/framework'

/**
 * 角色核心组件
 */
export class PlayerCore extends Component {
  constructor(
    public readonly name: string,
    private _exp: number,
    private _lv: number,
  ) {
    super()
  }

  get exp() {
    return this._exp
  }

  get lv() {
    return this._lv
  }

  addExp(val: number) {
    this._exp += val
    console.log('addExp', val, this._exp)
  }
}
