import { PaymentSchema } from '../Schema.ts'

export const PaymentStatusSchema = `${PaymentSchema}.status`
export type PaymentStatusSchema = typeof PaymentStatusSchema
