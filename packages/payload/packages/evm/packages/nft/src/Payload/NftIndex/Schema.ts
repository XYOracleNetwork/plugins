import { asSchema } from '@xyo-network/payload-model'

/**
 * The schema used for NFT Index payloads
 */
export const NftIndexSchema = asSchema('network.xyo.evm.nft.index', true)
/**
 * The schema used for NFT Index payloads
 */
export type NftIndexSchema = typeof NftIndexSchema
