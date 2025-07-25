import type { Entity, EntityId } from './Entity'
import {
  ComponentAddedEvent,
  ComponentRemovedEvent,
  EntityAddTagEvent,
  EntityRemoveTagEvent,
  type EventDispatcher,
} from './Event'
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

/**
 * 查询条件构建器
 */
export class QueryCriteriaBuilder {
  private _all: ComponentType[] = []
  private _any: ComponentType[] = []
  private _none: ComponentType[] = []
  private _key: string = ''

  constructor() {
    this.updateKey()
  }

  with(...components: ComponentType[]): this {
    this._all = components
    this.updateKey()
    return this
  }

  any(...components: ComponentType[]): this {
    this._any = components
    this.updateKey()
    return this
  }

  without(...components: ComponentType[]): this {
    this._none = components
    this.updateKey()
    return this
  }

  fromQueryCriteria(criteria: QueryCriteria): this {
    this._all = criteria.all || []
    this._any = criteria.any || []
    this._none = criteria.none || []
    this.updateKey()
    return this
  }

  get allComponents(): ComponentType[] {
    return this._all
  }

  get anyComponents(): ComponentType[] {
    return this._any
  }

  get noneComponents(): ComponentType[] {
    return this._none
  }

  get key(): string {
    return this._key
  }

  private updateKey(): void {
    // 生成唯一且稳定的key，格式：all:CompA,CompB|any:CompC|none:CompD
    const serialize = (arr: ComponentType[]) =>
      arr
        .map((c) => c.name)
        .sort()
        .join(',')

    this._key = `all:${serialize(this._all)}|any:${serialize(this._any)}|none:${serialize(this._none)}`
  }

  toCriteria(): QueryCriteria {
    return {
      all: this._all.length > 0 ? this._all : undefined,
      any: this._any.length > 0 ? this._any : undefined,
      none: this._none.length > 0 ? this._none : undefined,
    }
  }
}

export class EntityQuery {
  /* 实体集合 */
  private entities: Map<EntityId, Entity> = new Map()
  // 组件类型索引，存储实体ID集合
  private componentEntityIndex: Map<ComponentType, Set<EntityId>> = new Map()
  // 标签索引，存储标签对应的实体ID集合
  private tagEntityIndex: Map<string, Set<EntityId>> = new Map()
  /* 条件查询缓存 */
  private queryCache: Map<string, EntityId[]> = new Map()
  /* 标签查询缓存 */
  private tagQueryCache: Map<string, EntityId[]> = new Map()

  constructor(private readonly eventDispatcher: EventDispatcher) {
    // 订阅组件添加事件
    eventDispatcher.event$.subscribe((event) => {
      if (event instanceof ComponentAddedEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.indexEntityComponent(entity, event.componentType)
          this.clearQueryCache()
        }
      } else if (event instanceof ComponentRemovedEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.deindexEntityComponent(entity, event.componentType)
          this.clearQueryCache()
        }
      } else if (event instanceof EntityAddTagEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.indexEntityTag(entity, event.tag)
          this.clearTagCache()
        }
      } else if (event instanceof EntityRemoveTagEvent) {
        const entity = this.entities.get(event.entityId)
        if (entity) {
          this.deindexEntityTag(entity, event.tag)
          this.clearTagCache()
        }
      }
    })
  }

  addEntity(entity: Entity) {
    this.entities.set(entity.id, entity)
    // 建立标签索引
    if (entity.tags) {
      for (const tag of entity.tags) {
        this.indexEntityTag(entity, tag)
      }
    }
    this.clearQueryCache()
    this.clearTagCache()
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity.id)
    this.removeEntityFromIndex(entity)
    this.removeEntityFromTagIndex(entity)
    this.clearQueryCache()
    this.clearTagCache()
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

  /**
   * 建立实体标签索引
   * @param entity
   * @param tag
   */
  private indexEntityTag(entity: Entity, tag: string): void {
    let set = this.tagEntityIndex.get(tag)
    if (!set) {
      set = new Set()
      this.tagEntityIndex.set(tag, set)
    }
    set.add(entity.id)
  }

  /**
   * 删除实体标签索引
   * @param entity
   * @param tag
   */
  private deindexEntityTag(entity: Entity, tag: string): void {
    const set = this.tagEntityIndex.get(tag)
    if (set) {
      set.delete(entity.id)
      if (set.size === 0) {
        this.tagEntityIndex.delete(tag)
      }
    }
  }

  /**
   * 从所有标签索引中移除实体
   * @param entity
   * @returns
   */
  private removeEntityFromTagIndex(entity: Entity): void {
    if (!entity.tags) return
    for (const tag of entity.tags) {
      this.deindexEntityTag(entity, tag)
    }
  }

  /**
   * 清除条件查询缓存
   */
  private clearQueryCache(): void {
    this.queryCache.clear()
  }

  /**
   * 清空标签索引缓存
   */
  private clearTagCache(): void {
    this.tagQueryCache.clear()
  }

  query(criteria: QueryCriteriaBuilder | QueryCriteria): Entity[] {
    let cacheKey: string
    let queryCriteria: QueryCriteria

    if (criteria instanceof QueryCriteriaBuilder) {
      cacheKey = criteria.key
      queryCriteria = criteria.toCriteria()
    } else {
      cacheKey = JSON.stringify(criteria)
      queryCriteria = criteria
    }

    if (this.queryCache.has(cacheKey)) {
      const cachedIds = this.queryCache.get(cacheKey)!
      return cachedIds.map((id) => this.entities.get(id)!).filter(Boolean)
    }

    if (
      (!queryCriteria.all || queryCriteria.all.length === 0) &&
      (!queryCriteria.any || queryCriteria.any.length === 0) &&
      (!queryCriteria.none || queryCriteria.none.length === 0)
    ) {
      return Array.from(this.entities.values())
    }

    let candidates: Set<string> | null = null

    // All
    if (queryCriteria.all && queryCriteria.all.length > 0) {
      for (const compType of queryCriteria.all) {
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
    if (queryCriteria.any && queryCriteria.any.length > 0) {
      const anySet = new Set<string>()
      for (const compType of queryCriteria.any) {
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

    if (queryCriteria.none && queryCriteria.none.length > 0) {
      for (const compType of queryCriteria.none) {
        const set = this.componentEntityIndex.get(compType)
        if (set) {
          for (const id of set) {
            candidates.delete(id)
          }
        }
      }
    }

    const resultIds = Array.from(candidates)
    this.queryCache.set(cacheKey, resultIds)

    return resultIds.map((id) => this.entities.get(id)!).filter(Boolean)
  }

  /**
   * 根据标签查询实体
   * @param tag
   * @returns
   */
  queryByTag(...tags: string[]): Entity[] {
    const cacheKey = tags.slice().sort().join(',')

    if (this.tagQueryCache.has(cacheKey)) {
      const cachedIds = this.tagQueryCache.get(cacheKey)!
      return cachedIds.map((id) => this.entities.get(id)!).filter(Boolean)
    }

    if (tags.length === 0) {
      return Array.from(this.entities.values())
    }

    let candidates: Set<EntityId> | null = null
    for (const tag of tags) {
      const set = this.tagEntityIndex.get(tag)
      if (!set) {
        return []
      }
      if (candidates === null) {
        candidates = new Set(set)
      } else {
        candidates = new Set(Array.from(candidates as Set<string>).filter((id) => set.has(id)))
        if (candidates.size === 0) return []
      }
    }

    const resultIds = Array.from(candidates!)
    this.tagQueryCache.set(cacheKey, resultIds)

    return resultIds.map((id) => this.entities.get(id)!).filter(Boolean)
  }
}
