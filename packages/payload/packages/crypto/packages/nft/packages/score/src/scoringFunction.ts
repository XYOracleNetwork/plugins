import { AnyObject, EmptyObject } from '@xylabs/object'

import { PassFailScore, Score } from './score'

export type PassFailScoringFunction<T extends EmptyObject = AnyObject> = (payload: T) => PassFailScore | Promise<PassFailScore>
export type ScaledScoringFunction<T extends EmptyObject = AnyObject> = (payload: T) => Score | Promise<Score>
export type ScoringFunction<T extends EmptyObject = AnyObject> = PassFailScoringFunction<T> | ScaledScoringFunction<T>
