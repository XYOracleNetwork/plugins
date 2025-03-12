import type { EvmAddressFields } from '@xyo-network/evm-address-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { NftIndexSchema } from './Schema.ts'

/**
 * The fields of an NFT Index payload
 */
export interface NftIndexFields extends EvmAddressFields {
  /**
   * The index of the token
   */
  index: string
}

/**
 * A payload that contains an NFT Index
 */
export type NftIndex = Payload<NftIndexFields, NftIndexSchema>

/**
 * Checks if a payload is of type NftIndex
 * @param payload The payload to check
 * @returns True if the payload is of type NftIndex
 */
export const isNftIndex = isPayloadOfSchemaType<NftIndex>(NftIndexSchema)
