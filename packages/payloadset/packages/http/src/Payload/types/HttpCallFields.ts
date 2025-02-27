import { Queries } from './Queries.ts'
import { Verb } from './Verb.ts'

export interface HttpCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
