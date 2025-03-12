import type { WitnessParams } from '@xyo-network/witness-model'

import type { HttpCallWitnessConfig } from './Config.ts'

export type HttpCallWitnessParams = WitnessParams<
  HttpCallWitnessConfig,
  {
    headers?: Record<string, string | undefined>
    ipfsGateway?: string
  }
>
