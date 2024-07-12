import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasEthgasstationPayload } from './Payload.js'
import { EthereumGasEthgasstationSchema } from './Schema.js'

export const EthereumGasPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEthgasstationPayload>({
    schema: EthereumGasEthgasstationSchema,
  })
