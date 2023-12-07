import { AnyObject } from '@xyo-network/object'
import { Payload } from '@xyo-network/payload-model'

import { ScoringFunction } from './scoringFunction'

export interface WeightedScoringCriteria<T extends Payload = Payload<AnyObject>> {
  score: ScoringFunction<T>
  weight: number
}
