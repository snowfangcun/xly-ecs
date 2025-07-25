import type { IComponent4Entity } from './Entity'
import type { EventDispatcher } from './Event'

export abstract class Component {
  owner?: IComponent4Entity
  eventDispatcher?: EventDispatcher

  onAdded?(): void
  onRemoved?(): void
}
