import type { NftAttribute } from '../NftInfo/index.ts'
import type { DisplayType } from './DisplayType.ts'

export type OpenSeaNftAttribute = NftAttribute & {
  /**
   * A field indicating how you would like it to be displayed. For string traits, you don't have to worry about display_type.
   */
  display_type?: DisplayType
  max_value?: number
  /**
   * The name of the trait
   */
  trait_type: string
  /**
   * The value of the trait
   */
  value: string | number
}
