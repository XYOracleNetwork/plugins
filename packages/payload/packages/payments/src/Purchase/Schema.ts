import { asSchema } from '@xyo-network/payload-model'

import { PaymentsSchema } from '../Schema.ts'

export const PurchaseSchema = asSchema(`${PaymentsSchema}.purchase`, true)
export type PurchaseSchema = typeof PurchaseSchema
