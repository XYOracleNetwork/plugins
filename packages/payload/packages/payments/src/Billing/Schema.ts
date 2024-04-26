import { PaymentsSchema } from '../Schema'

export const BillingSchema = `${PaymentsSchema}.billing`
export type BillingSchema = typeof BillingSchema
