import { QueryCriteriaBuilder } from '@/framework'
import { P1 } from '../player/PlayerComp'

export const queryP1 = new QueryCriteriaBuilder().with(P1)
