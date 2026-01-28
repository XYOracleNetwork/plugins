import { asSchema } from '@xyo-network/payload-model'

export const SignatureSchema = asSchema('network.xyo.signing.signature', true)
export type SignatureSchema = typeof SignatureSchema
