import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasEthersPayload } from './Payload.js'
import { EthereumGasEthersSchema } from './Schema.js'

export const EthereumGasEthersPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEthersPayload>({
    schema: EthereumGasEthersSchema,
  })
