import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

export const EvmCallSchema = 'network.xyo.evm.call'
export type EvmCallSchema = typeof EvmCallSchema

export type EvmCall = Payload<
  {
    address?: string
    args?: unknown[]
    block?: number
    functionName?: string
  },
  EvmCallSchema
>

export const EvmCallResultSchema = 'network.xyo.evm.call.result'
export type EvmCallResultSchema = typeof EvmCallResultSchema

export type EvmCallResultBase = Payload<
  {
    address: string
    args: unknown[]
    block?: number
    chainId: number
    functionName: string
    implementation?: string
  },
  EvmCallResultSchema
>

export type EvmCallSuccess = EvmCallResultBase & {
  result: unknown
}

export type EvmCallFailure = EvmCallResultBase & {
  error: string
}

export type EvmCallResult = EvmCallSuccess | EvmCallFailure

export const isEvmCallSuccess = (payload?: EvmCallResult): payload is EvmCallSuccess => {
  return (payload as EvmCallSuccess | undefined)?.result !== undefined
}

export const isEvmCallFailure = (payload?: EvmCallResult): payload is EvmCallFailure => {
  return (payload as EvmCallFailure | undefined)?.error !== undefined
}

export const isEvmCallResult = isPayloadOfSchemaType<EvmCallResult>(EvmCallResultSchema)

export const asEvmCallSuccess = (payload?: EvmCallResult) => (isEvmCallSuccess(payload) ? payload : undefined)

export const asEvmCallFailure = (payload?: EvmCallResult) => (isEvmCallFailure(payload) ? payload : undefined)
