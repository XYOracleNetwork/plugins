import { DivinerConfig } from '@xyo-network/diviner-model'

import { CryptoContractDivinerSchema } from './Schema.ts'

export const CryptoContractDivinerConfigSchema = `${CryptoContractDivinerSchema}.config`
export type CryptoContractDivinerConfigSchema = typeof CryptoContractDivinerConfigSchema

export type CryptoContractDivinerConfig = DivinerConfig<{
  schema: CryptoContractDivinerConfigSchema
}>
