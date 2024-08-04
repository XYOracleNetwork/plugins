import { PaymentsSchema } from '../Schema.ts'

export const PurchaseSchema = `${PaymentsSchema}.purchase`
export type PurchaseSchema = typeof PurchaseSchema
