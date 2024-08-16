import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import type { NftIdFields } from '../NftId/index.ts'
import { NftMetadataUriSchema } from './Schema.ts'

/**
 * The fields of an NftMetadataUri payload
 */
export interface NftMetadataUriFields extends NftIdFields {
  /**
   * The metadata URI
   */
  metadataUri?: string
}

/**
 * A payload that contains an NftMetadataUri
 */
export type NftMetadataUri = Payload<NftMetadataUriFields, NftMetadataUriSchema>

/**
 * Checks if a payload is of type NftMetadataUri
 * @param payload The payload to check
 * @returns True if the payload is of type NftMetadataUri
 */
export const isNftMetadataUri = isPayloadOfSchemaType<NftMetadataUri>(NftMetadataUriSchema)
