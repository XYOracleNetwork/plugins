import { asSchema, type Payload } from '@xyo-network/payload-model'
import type { Fragment, JsonFragment } from 'ethers'

export type InterfaceAbi = string | ReadonlyArray<Fragment | JsonFragment | string>

export const EvmFunctionImplementedSchema = asSchema('network.xyo.evm.function.implemented', true)
export type EvmFunctionImplementedSchema = typeof EvmFunctionImplementedSchema

export type EvmFunctionImplemented = Payload<
  {
    address: string
    implemented: boolean
    selector: string
  },
  EvmFunctionImplementedSchema
>
