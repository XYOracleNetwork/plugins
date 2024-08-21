import type { AnyObject } from '@xylabs/object'
import type { Payload } from '@xyo-network/payload-model'

import type { ScoringFunction } from './scoringFunction.ts'

export interface WeightedScoringCriteria<T extends Payload = Payload<AnyObject>> {
  score: ScoringFunction<T>
  weight: number
}
