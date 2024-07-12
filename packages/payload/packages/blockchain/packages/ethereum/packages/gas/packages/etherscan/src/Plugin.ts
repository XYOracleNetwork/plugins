import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasEtherscanPayload } from './Payload.js'
import { EthereumGasEtherscanSchema } from './Schema.js'

export const EthereumGasEtherscanPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEtherscanPayload>({
    schema: EthereumGasEtherscanSchema,
  })
