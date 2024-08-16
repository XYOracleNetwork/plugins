import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { EthereumGasEthgasstationPayload } from './Payload.ts'
import { EthereumGasEthgasstationSchema } from './Schema.ts'

export const EthereumGasPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasEthgasstationPayload>({
    schema: EthereumGasEthgasstationSchema,
  })
