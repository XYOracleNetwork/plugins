import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { CryptoContractFunctionCallResult, CryptoContractFunctionCallResultSchema } from './Payload.ts'

export const CryptoContractFunctionCallPayloadPlugin = () =>
  createPayloadPlugin<CryptoContractFunctionCallResult>({
    schema: CryptoContractFunctionCallResultSchema,
  })
