import type { JsonValue } from '@xylabs/sdk-js'

export type NftAttribute = {
  display_type?: JsonValue
  trait_type?: JsonValue
  value?: JsonValue
} & {
  [key: string]: JsonValue
}
