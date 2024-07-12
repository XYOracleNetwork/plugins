import { Queries } from './Queries.js'
import { Verb } from './Verb.js'

export interface ApiCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
