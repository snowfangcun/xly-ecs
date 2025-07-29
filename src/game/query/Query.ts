import { QueryCriteriaBuilder } from '@/framework'
import { P1, PlayerCore } from '../player/PlayerComp'

export const queryP1 = new QueryCriteriaBuilder().with(P1)
export const queryPlayer = new QueryCriteriaBuilder().with(PlayerCore).by((entiity) => true)
