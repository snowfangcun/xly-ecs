import { ObjectResourcesLoader } from '@/framework/Resources'
import type { BaseStuffResources, GongfaResources } from './Types'

/**
 * 功法资源
 */
export const gongfaResourcesLoader = new ObjectResourcesLoader<GongfaResources>().registerBatch({
  chang_qing_gong: {
    name: '长青功',
    desc: '长青功',
    isStackable: false,
    useOptions: ['learn'],
  },
})

export const stuffResourcesLoader = new ObjectResourcesLoader<BaseStuffResources>()
  .merge(gongfaResourcesLoader)
  .toExport()
