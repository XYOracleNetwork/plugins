import { asSchema } from '@xyo-network/payload-model'

/**
 * The schema used for NFT ID payloads
 */
export const NftIdSchema = asSchema('network.xyo.evm.nft.id', true)
/**
 * The schema used for NFT ID payloads
 */
export type NftIdSchema = typeof NftIdSchema
