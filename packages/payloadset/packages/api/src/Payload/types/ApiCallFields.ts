import { Queries } from './Queries.ts'
import { Verb } from './Verb.ts'

export interface ApiCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
