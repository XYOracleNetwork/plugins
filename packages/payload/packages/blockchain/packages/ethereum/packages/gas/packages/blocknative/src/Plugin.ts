import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasBlocknativePayload } from './Payload.js'
import { EthereumGasBlocknativeSchema } from './Schema.js'

export const EthereumGasBlocknativePayloadPlugin = () =>
  createPayloadPlugin<EthereumGasBlocknativePayload>({
    schema: EthereumGasBlocknativeSchema,
  })
