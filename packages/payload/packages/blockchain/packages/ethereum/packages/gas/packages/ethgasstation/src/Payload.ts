import type { Payload } from '@xyo-network/payload-model'

import type { EthereumGasEthgasstationSchema } from './Schema.ts'

export interface EthereumGasEthgasstationResponse {
  baseFee: number
  blockNumber: number
  blockTime: number
  gasPrice: {
    fast: number
    instant: number
    standard: number
  }
  nextBaseFee: number
  priorityFee: {
    fast: number
    instant: number
    standard: number
  }
}

export type EthereumGasEthgasstationPayload = Payload<
  EthereumGasEthgasstationResponse & {
    schema: EthereumGasEthgasstationSchema
    timestamp: number
  }
>
