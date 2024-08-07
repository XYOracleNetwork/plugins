import { WitnessParams } from '@xyo-network/witness-model'

import { ApiCallWitnessConfig } from './Config.ts'

export type ApiCallWitnessParams = WitnessParams<
  ApiCallWitnessConfig,
  {
    headers?: Record<string, string | undefined>
    ipfsGateway?: string
  }
>
