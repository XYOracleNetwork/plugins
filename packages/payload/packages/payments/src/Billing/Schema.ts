import { PaymentsSchema } from '../Schema.ts'

export const BillingSchema = `${PaymentsSchema}.billing`
export type BillingSchema = typeof BillingSchema
