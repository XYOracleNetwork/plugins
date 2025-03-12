import type { Payload } from '@xyo-network/payload-model'

import type { FeeData } from './Model/index.ts'
import type { EthereumGasSchema } from './Schema.ts'

export type EthereumGasPayload = Payload<
  FeeData & {
    schema: EthereumGasSchema
    timestamp: number
  }
>
