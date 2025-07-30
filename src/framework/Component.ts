import type { IComponent4Entity } from './Entity'
import type { EventDispatcher } from './Event'

export abstract class Component {
  private _owner?: IComponent4Entity
  eventDispatcher?: EventDispatcher

  get owner(): IComponent4Entity {
    if (!this._owner) throw new Error('Component must be added to an entity')
    return this._owner
  }

  set owner(owner: IComponent4Entity | undefined) {
    this._owner = owner
  }

  onAdded?(): void
  onRemoved?(): void
}
