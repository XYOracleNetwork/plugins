import { JsonValue } from '@xylabs/object'

import { NftAttribute } from './NftAttribute'

export interface NftMetadata {
  [key: string]: JsonValue | NftAttribute[] | undefined
  attributes?: NftAttribute[] | JsonValue
  description?: JsonValue
  image?: JsonValue
  name?: JsonValue
}
