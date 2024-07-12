import { Payload } from '@xyo-network/payload-model'

import { FeeData } from './Model/index.js'
import { EthereumGasSchema } from './Schema.js'

export type EthereumGasPayload = Payload<
  FeeData & {
    schema: EthereumGasSchema
    timestamp: number
  }
>
