import type { JsonValue } from '@xylabs/object'

export interface NftAttribute {
  [key: string]: JsonValue | undefined
  display_type?: JsonValue
  trait_type?: JsonValue
  value?: JsonValue
}
