import { QueryCriteriaBuilder } from '@/framework'
import { P1, PlayerCore } from '../player/PlayerComp'

export const queryP1 = new QueryCriteriaBuilder().with(P1).build()
export const queryPlayerByUid = new QueryCriteriaBuilder()
  .with(PlayerCore)
  .by<[uid: string]>((entity, uid) => {
    return entity.getComponent(PlayerCore)!.uid === uid
  })
