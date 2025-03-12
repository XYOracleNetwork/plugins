import type { AddressTransactionHistoryWitnessConfigSchema } from '@xyo-network/crypto-address-transaction-history-payload-plugin'
import type { WitnessConfig } from '@xyo-network/witness-model'

export type AddressTransactionHistoryWitnessConfig = WitnessConfig<{
  address?: string
  schema: AddressTransactionHistoryWitnessConfigSchema
}>
