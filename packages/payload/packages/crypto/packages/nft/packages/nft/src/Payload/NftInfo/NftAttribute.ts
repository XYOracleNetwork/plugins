import { JsonValue } from '@xylabs/object'

export type NftAttribute = {
  display_type?: JsonValue
  trait_type?: JsonValue
  value?: JsonValue
} & {
  [key: string]: JsonValue
}
