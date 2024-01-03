import { DivinerParams } from '@xyo-network/diviner-model'
import { AnyConfigSchema } from '@xyo-network/module-model'

import { EvmCallResultToNftTokenUriDivinerConfig } from './Config'

/**
 * The params for the EVM call result to NFT token URI diviner
 */
export type EvmCallResultToNftTokenUriDivinerParams = DivinerParams<AnyConfigSchema<EvmCallResultToNftTokenUriDivinerConfig>>
