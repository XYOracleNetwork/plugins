import { EvmWitnessConfig, EvmWitnessParams } from '@xyo-network/witness-evm-abstract'
import { Fragment, JsonFragment } from 'ethers'

export type InterfaceAbi = string | ReadonlyArray<Fragment | JsonFragment | string>

export const EvmEventsWitnessConfigSchema = 'network.xyo.evm.events.witness.config'
export type EvmEventsWitnessConfigSchema = typeof EvmEventsWitnessConfigSchema

export type EvmEventsWitnessConfig = EvmWitnessConfig<
  {
    abi?: InterfaceAbi
    address?: string
    eventName?: string
    fromBlock?: number
    toBlock?: number
  },
  EvmEventsWitnessConfigSchema
>

export type EvmEventsWitnessParams = EvmWitnessParams<EvmEventsWitnessConfig>
