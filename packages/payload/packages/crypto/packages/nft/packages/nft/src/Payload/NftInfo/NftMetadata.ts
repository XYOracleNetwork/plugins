import type { JsonValue } from '@xylabs/object'

import type { NftAttribute } from './NftAttribute.ts'

export type NftMetadata = {
  attributes?: NftAttribute[] | JsonValue
  description?: JsonValue
  image?: JsonValue
  name?: JsonValue
} & {
  [key: string]: JsonValue | NftAttribute[]
}
