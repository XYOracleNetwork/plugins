import { PaymentsSchema } from '../Schema'

export const PurchaseSchema = `${PaymentsSchema}.purchase`
export type PurchaseSchema = typeof PurchaseSchema
