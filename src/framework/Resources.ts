export abstract class BaseResourcesLoader<T> {
  protected readonly dic: Map<string, T> = new Map()
  /**
   * 注册资源
   * @param key
   * @param resources
   */
  register(key: string, resources: T): void {
    if (this.dic.has(key)) {
      throw new Error(`资源 ${key} 已经存在`)
    }
    this.dic.set(key, resources)
  }

  /**
   * 批量注册资源
   * @param resources
   */
  registerBatch(resources: Record<string, T>): this {
    for (const key in resources) {
      this.register(key, resources[key])
    }
    return this
  }

  /**
   * 获取资源
   * @param key 资源键
   * @returns 资源
   */
  get(key: string): T {
    if (!this.dic.has(key)) {
      throw new Error(`资源 ${key} 不存在`)
    }
    return this.dic.get(key) as T
  }

  /**
   * 是否存在资源
   * @param key 资源键
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.dic.has(key)
  }

  /**
   * 根据条件获取资源
   * @param criteria 条件
   * @returns 资源数组
   */
  getByCriteria(criteria: (key: string, resources: T) => boolean): T[] {
    const res: T[] = []
    for (const [key, resources] of this.dic) {
      if (criteria(key, resources)) {
        res.push(resources)
      }
    }
    return res
  }
}

/**
 * 文本资源加载器
 */
export class StringResourcesLoader extends BaseResourcesLoader<string> {}

/**
 * 函数资源加载器
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FunResources<TParam extends any[], TResult> extends BaseResourcesLoader<
  (...args: TParam) => TResult
> {}

/**
 * 对象资源加载器
 */
export class ObjectResourcesLoader<T extends object> extends BaseResourcesLoader<Readonly<T>> {
  register(key: string, resources: Readonly<T>): void {
    /* 将资源对象冻结 */
    const obj = deepFreeze(resources)
    super.register(key, obj)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepFreeze(obj: any) {
  Object.freeze(obj)
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]) // 递归冻结嵌套对象
    }
  }
  return obj
}
