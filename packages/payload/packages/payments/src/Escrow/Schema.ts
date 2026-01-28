import { asSchema } from '@xyo-network/payload-model'

export const EscrowSchema = asSchema('network.xyo.escrow', true)
export type EscrowSchema = typeof EscrowSchema
