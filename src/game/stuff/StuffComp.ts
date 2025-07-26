import { Component } from '@/framework'
import type { StuffBoxData } from '../base/Types'

export class StuffBox extends Component {
  constructor(private _data: StuffBoxData) {
    super()
  }
}
