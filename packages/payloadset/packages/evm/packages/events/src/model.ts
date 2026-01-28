import { asSchema } from '@xyo-network/payload-model'
import type { EvmWitnessConfig, EvmWitnessParams } from '@xyo-network/witness-evm-abstract'
import type { Fragment, JsonFragment } from 'ethers'

export type InterfaceAbi = string | ReadonlyArray<Fragment | JsonFragment | string>

export const EvmEventsWitnessConfigSchema = asSchema('network.xyo.evm.events.witness.config', true)
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
