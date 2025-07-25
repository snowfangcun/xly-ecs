import type { Entity, EntityId } from './Entity'
import { ComponentAddedEvent, ComponentRemovedEvent, type EventDispatcher } from './Event'
import type { ComponentType } from './Types'

/**
 * 查询条件
 */
export type QueryCriteria = {
  /**
   * 必须存在的组件
   */
  all?: ComponentType[]
  /**
   * 任意之一的组件
   */
  any?: ComponentType[]
  /**
   * 不存在的组件
   */
  none?: ComponentType[]
}

export class EntityQuery {
  // 组件类型索引，存储实体ID集合
  private componentEntityIndex: Map<ComponentType, Set<EntityId>> = new Map()
  private entities: Map<EntityId, Entity> = new Map()

  constructor(private readonly eventDispatcher: EventDispatcher) {
    // 订阅组件添加事件
    eventDispatcher.event$.subscribe((event) => {
      if (event instanceof ComponentAddedEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.indexEntityComponent(entity, event.componentType)
        }
      } else if (event instanceof ComponentRemovedEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.deindexEntityComponent(entity, event.componentType)
        }
      }
    })
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity)
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity.id)
    this.removeEntityFromIndex(entity)
  }

  /**
   * 建立实体的组件索引
   * @param entity
   */
  private indexEntityComponent(entity: Entity, compType: ComponentType): void {
    let set = this.componentEntityIndex.get(compType)
    if (!set) {
      set = new Set()
      this.componentEntityIndex.set(compType, set)
    }
    set.add(entity.id)
  }

  /**
   * 删除实体的组件索引
   * @param entity
   * @param compType
   */
  private deindexEntityComponent(entity: Entity, compType: ComponentType): void {
    const set = this.componentEntityIndex.get(compType)
    if (set) {
      set.delete(entity.id)
      if (set.size === 0) {
        this.componentEntityIndex.delete(compType)
      }
    }
  }

  /**
   * 删除实体的索引
   * @param entity
   */
  removeEntityFromIndex(entity: Entity): void {
    for (const compType of entity.componentTypes) {
      this.deindexEntityComponent(entity, compType)
    }
  }

  query(criteria: QueryCriteria): Entity[] {
    if (
      (!criteria.all || criteria.all.length === 0) &&
      (!criteria.any || criteria.any.length === 0) &&
      (!criteria.none || criteria.none.length === 0)
    ) {
      return Array.from(this.entities.values())
    }

    let candidates: Set<string> | null = null

    // All
    if (criteria.all && criteria.all.length > 0) {
      for (const compType of criteria.all) {
        const set = this.componentEntityIndex.get(compType)
        if (!set) {
          return []
        }

        if (candidates === null) {
          candidates = new Set(set)
        } else {
          candidates = new Set(
            Array.from(candidates as Set<string>).filter((e: string) => set.has(e)),
          )
          if (candidates.size === 0) return []
        }
      }
    }

    // any
    if (criteria.any && criteria.any.length > 0) {
      const anySet = new Set<string>()
      for (const compType of criteria.any) {
        const set = this.componentEntityIndex.get(compType)
        if (set) {
          for (const id of set) {
            anySet.add(id)
          }
        }
      }
      if (anySet.size === 0) {
        return []
      }
      if (candidates === null) {
        candidates = anySet
      } else {
        candidates = new Set([...candidates].filter((id) => anySet.has(id)))
        if (candidates.size === 0) return []
      }
    }

    // None
    if (candidates === null) {
      candidates = new Set(this.entities.keys())
    }

    if (criteria.none && criteria.none.length > 0) {
      for (const compType of criteria.none) {
        const set = this.componentEntityIndex.get(compType)
        if (set) {
          for (const id of set) {
            candidates.delete(id)
          }
        }
      }
    }

    // Ensure a return value in all cases
    return Array.from(candidates)
      .map((id) => this.entities.get(id)!)
      .filter(Boolean)
  }
}
