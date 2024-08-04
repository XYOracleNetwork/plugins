import { AddressTransactionHistoryPayload } from './Payload.ts'
import { AddressTransactionHistorySchema } from './Schema.ts'

export const addressTransactionHistoryPayloadTemplate = (): Partial<AddressTransactionHistoryPayload> => ({
  schema: AddressTransactionHistorySchema,
})
