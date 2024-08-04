import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasBlocknativePayload } from './Payload.ts'
import { EthereumGasBlocknativeSchema } from './Schema.ts'

export const EthereumGasBlocknativePayloadPlugin = () =>
  createPayloadPlugin<EthereumGasBlocknativePayload>({
    schema: EthereumGasBlocknativeSchema,
  })
