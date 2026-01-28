import { asSchema } from '@xyo-network/payload-model'

export type AddressTransactionHistorySchema = typeof AddressTransactionHistorySchema
export const AddressTransactionHistorySchema = asSchema('network.xyo.crypto.address.transaction', true)

export type AddressTransactionHistoryWitnessConfigSchema = typeof AddressTransactionHistoryWitnessConfigSchema
export const AddressTransactionHistoryWitnessConfigSchema = asSchema(`${AddressTransactionHistorySchema}.witness.config`, true)
