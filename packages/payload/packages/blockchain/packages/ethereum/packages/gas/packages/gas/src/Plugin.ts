import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasPayload } from './Payload.js'
import { EthereumGasSchema } from './Schema.js'
import { ethereumGasPayloadTemplate } from './Template.js'

export const EthereumGasPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasPayload>({
    schema: EthereumGasSchema,
    template: ethereumGasPayloadTemplate,
  })
