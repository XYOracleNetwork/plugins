import { PaymentsSchema } from '../Schema.js'

export const PurchaseSchema = `${PaymentsSchema}.purchase`
export type PurchaseSchema = typeof PurchaseSchema
