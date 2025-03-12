import type { EthereumGasPayload } from './Payload.ts'
import { EthereumGasSchema } from './Schema.ts'

export const ethereumGasPayloadTemplate = (): Partial<EthereumGasPayload> => ({ schema: EthereumGasSchema })
