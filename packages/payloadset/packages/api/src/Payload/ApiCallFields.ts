import { Queries } from './Queries'
import { Verb } from './Verb'

export interface ApiCallFields {
  headers?: Record<string, string | undefined>
  queries?: Queries
  verb?: Verb
}
