import type { Payload } from '@xyo-network/payload-model'

import type { EthereumGasBlocknativeSchema } from './Schema.ts'

export type WithConfidence<T> = T & {
  confidence: number
}
export interface BaseFee {
  baseFee: number
}

export interface EstimatedPrice {
  maxFeePerGas: number
  maxPriorityFeePerGas: number
  price: number
}

export interface BlockPrice {
  baseFeePerGas: number
  blockNumber: number
  estimatedPrices: WithConfidence<EstimatedPrice>[]
  estimatedTransactionCount: number
}

export type PendingBlockNumber = 'pending+1' | 'pending+2' | 'pending+3' | 'pending+4' | 'pending+5'

export type EstimatedBaseFee = {
  [key in PendingBlockNumber]: [WithConfidence<BaseFee>]
}

export interface EthereumGasBlocknativeResponse {
  blockPrices: BlockPrice[]
  currentBlockNumber: number
  estimatedBaseFees: EstimatedBaseFee[]
  maxPrice: number
  msSinceLastBlock: number
  network: 'main'
  system: 'ethereum'
  timestamp: number
  unit: 'gwei'
}

export type EthereumGasBlocknativePayload = Payload<
  EthereumGasBlocknativeResponse & {
    schema: EthereumGasBlocknativeSchema
  }
>
