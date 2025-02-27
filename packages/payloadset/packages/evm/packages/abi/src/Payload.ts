import { Payload } from '@xyo-network/payload-model'
import { Fragment, JsonFragment } from 'ethers'

export type InterfaceAbi = string | ReadonlyArray<Fragment | JsonFragment | string>

export const EvmFunctionImplementedSchema = 'network.xyo.evm.function.implemented'
export type EvmFunctionImplementedSchema = typeof EvmFunctionImplementedSchema

export type EvmFunctionImplemented = Payload<
  {
    address: string
    implemented: boolean
    selector: string
  },
  EvmFunctionImplementedSchema
>
