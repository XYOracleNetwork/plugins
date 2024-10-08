import type { Payload } from '@xyo-network/payload-model'

import type { EthereumGasEtherchainV2Schema } from './Schema.ts'

export interface EthereumGasEtherchainV2Response {
  code: number
  data: {
    fast: number
    priceUSD: number
    rapid: number
    slow: number
    standard: number
    timestamp: number
  }
}

export type EthereumGasEtherchainV2Payload = Payload<
  EthereumGasEtherchainV2Response & {
    schema: EthereumGasEtherchainV2Schema
    timestamp: number
  }
>
