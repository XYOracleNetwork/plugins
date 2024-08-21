import type { Queries } from './Queries.ts'
import type { Verb } from './Verb.ts'

export interface ApiCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
