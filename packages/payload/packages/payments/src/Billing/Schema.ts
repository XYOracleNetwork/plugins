import { asSchema } from '@xyo-network/payload-model'

import { PaymentsSchema } from '../Schema.ts'

export const BillingSchema = asSchema(`${PaymentsSchema}.billing`, true)
export type BillingSchema = typeof BillingSchema
