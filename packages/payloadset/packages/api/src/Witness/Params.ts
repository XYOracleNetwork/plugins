import type { WitnessParams } from '@xyo-network/witness-model'

import type { ApiCallWitnessConfig } from './Config.ts'

export type ApiCallWitnessParams = WitnessParams<
  ApiCallWitnessConfig,
  {
    headers?: Record<string, string | undefined>
    ipfsGateway?: string
  }
>
