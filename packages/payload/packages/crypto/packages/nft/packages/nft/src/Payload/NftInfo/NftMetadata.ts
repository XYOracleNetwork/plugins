import type { JsonValue } from '@xylabs/object'

import type { NftAttribute } from './NftAttribute.ts'

export interface NftMetadata {
  [key: string]: JsonValue | NftAttribute[] | undefined
  attributes?: NftAttribute[] | JsonValue
  description?: JsonValue
  image?: JsonValue
  name?: JsonValue
}
