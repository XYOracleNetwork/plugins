import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

import { EvmCallResultToNftTokenUriDivinerSchema } from './Schema.ts'

/**
 * The config schema for the EVM call result to NFT token URI diviner
 */
export const EvmCallResultToNftTokenUriDivinerConfigSchema = asSchema(`${EvmCallResultToNftTokenUriDivinerSchema}.config`, true)
/**
 * The config schema for the EVM call result to NFT token URI diviner
 */
export type EvmCallResultToNftTokenUriDivinerConfigSchema = typeof EvmCallResultToNftTokenUriDivinerConfigSchema

/**
 * The config for the EVM call result to NFT token URI diviner
 */
export type EvmCallResultToNftTokenUriDivinerConfig = DivinerConfig<{ schema: EvmCallResultToNftTokenUriDivinerConfigSchema }>
