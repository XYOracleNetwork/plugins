import { Payload } from '@xyo-network/payload-model'

export const EvmContractSchema = 'network.xyo.evm.contract'
export type EvmContractSchema = typeof EvmContractSchema

export type EvmContract = Payload<
  {
    address: string
    block: number
    chainId: number
    code?: string
  },
  EvmContractSchema
>
