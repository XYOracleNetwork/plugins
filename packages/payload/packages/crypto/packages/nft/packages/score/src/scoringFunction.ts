import type { AnyObject, EmptyObject } from '@xylabs/sdk-js'

import type { PassFailScore, Score } from './score.ts'

export type PassFailScoringFunction<T extends EmptyObject = AnyObject> = (payload: T) => PassFailScore | Promise<PassFailScore>
export type ScaledScoringFunction<T extends EmptyObject = AnyObject> = (payload: T) => Score | Promise<Score>
export type ScoringFunction<T extends EmptyObject = AnyObject> = PassFailScoringFunction<T> | ScaledScoringFunction<T>
