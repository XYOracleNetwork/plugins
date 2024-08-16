import type { Payload } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'
import type { JsonFragment } from 'ethers'

export const CryptoContractFunctionReadWitnessConfigSchema = 'network.xyo.crypto.contract.function.read.config'
export type CryptoContractFunctionReadWitnessConfigSchema = typeof CryptoContractFunctionReadWitnessConfigSchema

export type Abi = string | ReadonlyArray<JsonFragment | string>

export type CryptoContractFunctionReadWitnessConfig = WitnessConfig<{
  abi: Abi
  address?: string
  args?: unknown[]
  functionName?: string
  schema: CryptoContractFunctionReadWitnessConfigSchema
}>

export const CryptoContractFunctionCallSchema = 'network.xyo.crypto.contract.function.call'
export type CryptoContractFunctionCallSchema = typeof CryptoContractFunctionCallSchema

export type CryptoContractFunctionCall = Payload<
  {
    address?: string
    args?: unknown[]
    functionName?: string
  },
  CryptoContractFunctionCallSchema
>

export const CryptoContractFunctionCallResultSchema = 'network.xyo.crypto.contract.function.call.result'
export type CryptoContractFunctionCallResultSchema = typeof CryptoContractFunctionCallResultSchema

export type CryptoContractFunctionCallResultBase = Payload<
  {
    address: string
    args: unknown[]
    chainId: number
    functionName: string
  },
  CryptoContractFunctionCallResultSchema
>

export type CryptoContractFunctionCallSuccess = CryptoContractFunctionCallResultBase & {
  result: unknown
}

export type CryptoContractFunctionCallFailure = CryptoContractFunctionCallResultBase & {
  error: string
}

export type CryptoContractFunctionCallResult = CryptoContractFunctionCallSuccess | CryptoContractFunctionCallFailure

export const isCryptoContractFunctionCallResult = (payload?: Payload): payload is CryptoContractFunctionCallSuccess => {
  return payload?.schema === CryptoContractFunctionCallResultSchema
}

export const isCryptoContractFunctionCallSuccess = (payload?: CryptoContractFunctionCallResult): payload is CryptoContractFunctionCallSuccess => {
  return (payload as CryptoContractFunctionCallSuccess | undefined)?.result !== undefined
}

export const isCryptoContractFunctionCallFailure = (payload?: CryptoContractFunctionCallResult): payload is CryptoContractFunctionCallFailure => {
  return (payload as CryptoContractFunctionCallFailure | undefined)?.error !== undefined
}

export const asCryptoContractFunctionCallSuccess = (payload?: CryptoContractFunctionCallResult) =>
  isCryptoContractFunctionCallSuccess(payload) ? payload : undefined

export const asCryptoContractFunctionCallFailure = (payload?: CryptoContractFunctionCallResult) =>
  isCryptoContractFunctionCallFailure(payload) ? payload : undefined
