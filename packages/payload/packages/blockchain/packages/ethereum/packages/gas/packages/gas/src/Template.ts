import { EthereumGasPayload } from './Payload.js'
import { EthereumGasSchema } from './Schema.js'

export const ethereumGasPayloadTemplate = (): Partial<EthereumGasPayload> => ({
  schema: EthereumGasSchema,
})
