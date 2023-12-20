import { BlockchainWitnessConfig, BlockchainWitnessParams } from '@xyo-network/witness-blockchain-abstract'
import { JsonFragment } from 'ethers'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const EvmCallWitnessConfigSchema = 'network.xyo.evm.call.witness.config'
export type EvmCallWitnessConfigSchema = typeof EvmCallWitnessConfigSchema

export type EvmCallWitnessConfig = BlockchainWitnessConfig<
  {
    abi?: Abi
    address?: string
    args?: unknown[]
    block?: number
    functionName?: string
  },
  EvmCallWitnessConfigSchema
>

export type EvmCallWitnessParams = BlockchainWitnessParams<EvmCallWitnessConfig>
