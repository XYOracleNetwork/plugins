import { Payload } from '@xyo-network/payload-model'

import { FeeData } from './Model/index.ts'
import { EthereumGasSchema } from './Schema.ts'

export type EthereumGasPayload = Payload<
  FeeData & {
    schema: EthereumGasSchema
    timestamp: number
  }
>
