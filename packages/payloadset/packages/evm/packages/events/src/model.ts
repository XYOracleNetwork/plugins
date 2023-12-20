import { EvmWitnessConfig, EvmWitnessParams } from '@xyo-network/witness-evm-abstract'
import { JsonFragment } from 'ethers'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const EvmEventsWitnessConfigSchema = 'network.xyo.evm.events.witness.config'
export type EvmEventsWitnessConfigSchema = typeof EvmEventsWitnessConfigSchema

export type EvmEventsWitnessConfig = EvmWitnessConfig<
  {
    abi?: Abi
    address?: string
    eventName?: string
    fromBlock?: number
    toBlock?: number
  },
  EvmEventsWitnessConfigSchema
>

export type EvmEventsWitnessParams = EvmWitnessParams<EvmEventsWitnessConfig>
