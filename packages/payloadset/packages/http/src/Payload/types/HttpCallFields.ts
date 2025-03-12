import type { Queries } from './Queries.ts'
import type { Verb } from './Verb.ts'

export interface HttpCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
