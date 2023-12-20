import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

import { NftIdSchema } from './Schema'

export interface NftIdFields {
  address: string
  chainId: number
  tokenId: string
}

export type NftId = Payload<NftIdFields, NftIdSchema>

export const isNftId = isPayloadOfSchemaType<NftId>(NftIdSchema)
