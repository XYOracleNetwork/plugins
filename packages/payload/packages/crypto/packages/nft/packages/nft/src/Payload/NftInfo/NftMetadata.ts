import { JsonValue } from '@xylabs/object'

import { NftAttribute } from './NftAttribute.ts'

export type NftMetadata = {
  attributes?: NftAttribute[] | JsonValue
  description?: JsonValue
  image?: JsonValue
  name?: JsonValue
} & {
  [key: string]: JsonValue | NftAttribute[]
}
