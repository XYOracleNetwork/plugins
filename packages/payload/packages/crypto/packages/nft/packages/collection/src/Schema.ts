import { asSchema } from '@xyo-network/payload-model'

export type NftCollectionSchema = typeof NftCollectionSchema
export const NftCollectionSchema = asSchema('network.xyo.crypto.nft.collection', true)
