import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { CryptoContractFunctionCallResult } from './Payload.ts'
import { CryptoContractFunctionCallResultSchema } from './Payload.ts'

export const CryptoContractFunctionCallPayloadPlugin = () =>
  createPayloadPlugin<CryptoContractFunctionCallResult>({ schema: CryptoContractFunctionCallResultSchema })
