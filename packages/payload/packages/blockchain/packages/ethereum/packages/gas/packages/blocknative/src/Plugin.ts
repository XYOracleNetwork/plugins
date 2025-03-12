import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { EthereumGasBlocknativePayload } from './Payload.ts'
import { EthereumGasBlocknativeSchema } from './Schema.ts'

export const EthereumGasBlocknativePayloadPlugin = () =>
  createPayloadPlugin<EthereumGasBlocknativePayload>({ schema: EthereumGasBlocknativeSchema })
