import { asSchema } from '@xyo-network/payload-model'

import { BillingSchema } from '../Schema.ts'

export const BillingAddressSchema = asSchema(`${BillingSchema}.address`, true)
export type BillingAddressSchema = typeof BillingAddressSchema
