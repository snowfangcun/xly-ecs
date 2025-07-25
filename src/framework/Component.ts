import type { IComponent4Entity } from './Entity'

export abstract class Component {
  owner?: IComponent4Entity

  onAdded?(): void
  onRemoved?(): void

}
