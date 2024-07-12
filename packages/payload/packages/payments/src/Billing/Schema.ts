import { PaymentsSchema } from '../Schema.js'

export const BillingSchema = `${PaymentsSchema}.billing`
export type BillingSchema = typeof BillingSchema
