import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { EthereumGasEtherscanPayload } from './Payload.ts'
import { EthereumGasEtherscanSchema } from './Schema.ts'

export const EthereumGasEtherscanPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEtherscanPayload>({
    schema: EthereumGasEtherscanSchema,
  })
