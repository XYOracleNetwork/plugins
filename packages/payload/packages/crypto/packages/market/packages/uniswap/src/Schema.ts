import { asSchema } from '@xyo-network/payload-model'

export type UniswapCryptoMarketWitnessConfigSchema = typeof UniswapCryptoMarketWitnessConfigSchema
export const UniswapCryptoMarketWitnessConfigSchema = asSchema('network.xyo.crypto.market.uniswap.witness.config', true)

export type UniswapV4CryptoMarketWitnessConfigSchema = typeof UniswapV4CryptoMarketWitnessConfigSchema
export const UniswapV4CryptoMarketWitnessConfigSchema = asSchema('network.xyo.crypto.market.uniswap.v4.witness.config', true)

export type UniswapCryptoMarketSchema = typeof UniswapCryptoMarketSchema
export const UniswapCryptoMarketSchema = asSchema('network.xyo.crypto.market.uniswap', true)
