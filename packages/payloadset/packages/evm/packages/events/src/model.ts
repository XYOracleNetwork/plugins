import { BlockchainWitnessConfig, BlockchainWitnessParams } from '@xyo-network/witness-blockchain-abstract'
import { JsonFragment } from 'ethers'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const EvmEventsWitnessConfigSchema = 'network.xyo.evm.events.witness.config'
export type EvmEventsWitnessConfigSchema = typeof EvmEventsWitnessConfigSchema

export type EvmEventsWitnessConfig = BlockchainWitnessConfig<
  {
    abi?: Abi
    address?: string
    eventName?: string
    fromBlock?: number
    toBlock?: number
  },
  EvmEventsWitnessConfigSchema
>

export type EvmEventsWitnessParams = BlockchainWitnessParams<EvmEventsWitnessConfig>
