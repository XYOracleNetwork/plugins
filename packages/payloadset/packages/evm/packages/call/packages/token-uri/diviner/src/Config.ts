import { DivinerConfig } from '@xyo-network/diviner-model'

import { EvmCallResultToNftTokenUriDivinerSchema } from './Schema'

/**
 * The config schema for the EVM call result to NFT token URI diviner
 */
export const EvmCallResultToNftTokenUriDivinerConfigSchema = `${EvmCallResultToNftTokenUriDivinerSchema}.config`
/**
 * The config schema for the EVM call result to NFT token URI diviner
 */
export type EvmCallResultToNftTokenUriDivinerConfigSchema = typeof EvmCallResultToNftTokenUriDivinerConfigSchema

/**
 * The config for the EVM call result to NFT token URI diviner
 */
export type EvmCallResultToNftTokenUriDivinerConfig = DivinerConfig<{ schema: EvmCallResultToNftTokenUriDivinerConfigSchema }>
