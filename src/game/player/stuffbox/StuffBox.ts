/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@esengine/ecs-framework'

export type StuffItem = {
  uuid: string
  key: string
  count: number
  data?: any
}

export type StuffBoxItems = StuffItem[]

export class StuffBox extends Component {
  constructor(public items: StuffBoxItems = []) {
    super()
  }
}
