import { AnyObject } from '@xylabs/object'
import { Payload } from '@xyo-network/payload-model'

import { ScoringFunction } from './scoringFunction.js'

export interface WeightedScoringCriteria<T extends Payload = Payload<AnyObject>> {
  score: ScoringFunction<T>
  weight: number
}
