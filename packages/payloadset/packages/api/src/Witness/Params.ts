import type { WitnessParams } from '@xyo-network/witness-model'

import type { ApiCallWitnessConfig } from './Config.ts'

export interface ApiCallWitnessParams extends WitnessParams<
  ApiCallWitnessConfig>
{
  headers?: Record<string, string | undefined>
  ipfsGateway?: string
}
