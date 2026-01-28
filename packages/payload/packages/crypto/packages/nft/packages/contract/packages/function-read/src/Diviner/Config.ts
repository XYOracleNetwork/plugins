import type { DivinerConfig } from '@xyo-network/diviner-model'
import { asSchema } from '@xyo-network/payload-model'

import { CryptoContractDivinerSchema } from './Schema.ts'

export const CryptoContractDivinerConfigSchema = asSchema(`${CryptoContractDivinerSchema}.config`, true)
export type CryptoContractDivinerConfigSchema = typeof CryptoContractDivinerConfigSchema

export type CryptoContractDivinerConfig = DivinerConfig<{
  schema: CryptoContractDivinerConfigSchema
}>
