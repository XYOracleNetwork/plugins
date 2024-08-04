import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { EthereumGasPayload } from './Payload.ts'
import { EthereumGasSchema } from './Schema.ts'
import { ethereumGasPayloadTemplate } from './Template.ts'

export const EthereumGasPayloadPlugin = () =>
  createPayloadPlugin<EthereumGasPayload>({
    schema: EthereumGasSchema,
    template: ethereumGasPayloadTemplate,
  })
