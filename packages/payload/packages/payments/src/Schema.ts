import { asSchema } from '@xyo-network/payload-model'

export const PaymentsSchema = asSchema('network.xyo.payments', true)
export type PaymentsSchema = typeof PaymentsSchema
