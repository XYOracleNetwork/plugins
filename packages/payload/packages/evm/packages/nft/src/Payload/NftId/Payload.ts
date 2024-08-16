import type { EvmAddressFields } from '@xyo-network/evm-address-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { NftIdSchema } from './Schema.ts'

/**
 * The fields of an NFT ID payload
 */
export interface NftIdFields extends EvmAddressFields {
  // TODO: Add these fields here? Make optional? Derive from this and make another payload?
  // /**
  //  * Total supply of the token
  //  */
  // supply: string
  // TODO: type number instead?
  /**
   * The token ID
   */
  tokenId: string
}

/**
 * A payload that contains an NFT ID
 */
export type NftId = Payload<NftIdFields, NftIdSchema>

/**
 * Checks if a payload is of type NftId
 * @param payload The payload to check
 * @returns True if the payload is of type NftId
 */
export const isNftId = isPayloadOfSchemaType<NftId>(NftIdSchema)
