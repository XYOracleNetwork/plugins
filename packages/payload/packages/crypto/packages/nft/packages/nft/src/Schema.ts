import { asSchema } from '@xyo-network/payload-model'

export type NftSchema = typeof NftSchema
export const NftSchema = asSchema('network.xyo.crypto.nft', true)
