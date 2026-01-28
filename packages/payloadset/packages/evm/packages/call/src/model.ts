import { asSchema } from '@xyo-network/payload-model'
import type { EvmWitnessConfig, EvmWitnessParams } from '@xyo-network/witness-evm-abstract'
import type { JsonFragment } from 'ethers'

export type Abi = string | ReadonlyArray<JsonFragment | string>

export const EvmCallWitnessConfigSchema = asSchema('network.xyo.evm.call.witness.config', true)
export type EvmCallWitnessConfigSchema = typeof EvmCallWitnessConfigSchema

export type EvmCallWitnessConfig = EvmWitnessConfig<
  {
    abi?: Abi
    address?: string
    args?: unknown[]
    block?: number
    functionName?: string
  },
  EvmCallWitnessConfigSchema
>

export type EvmCallWitnessParams = EvmWitnessParams<EvmCallWitnessConfig>
