import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { EthereumGasEthersPayload } from './Payload.ts'
import { EthereumGasEthersSchema } from './Schema.ts'

export const EthereumGasEthersPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEthersPayload>({
    schema: EthereumGasEthersSchema,
  })
