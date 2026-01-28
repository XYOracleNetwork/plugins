import { asSchema } from '@xyo-network/payload-model'

export type CryptoMarketAssetSchema = typeof CryptoMarketAssetSchema
export const CryptoMarketAssetSchema = asSchema('network.xyo.crypto.asset', true)
