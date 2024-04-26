import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, Payload } from '@xyo-network/payload-model'

export const RebillyPaymentAuthorizationTokenSchema = 'network.xyo.payments.payment.authorization.token.rebilly'
export type RebillyPaymentAuthorizationTokenSchema = typeof RebillyPaymentAuthorizationTokenSchema

/**
 * A payment authorization token
 */
export interface RebillyPaymentAuthorizationTokenFields {
  id: string
}

/**
 * A payment authorization token payload
 */
export type RebillyPaymentAuthorizationToken = Payload<RebillyPaymentAuthorizationTokenFields, RebillyPaymentAuthorizationTokenSchema>

/**
 * Identity function for RebillyPaymentAuthorizationToken payload
 */
export const isRebillyPaymentAuthorizationToken = isPayloadOfSchemaType<RebillyPaymentAuthorizationToken>(RebillyPaymentAuthorizationTokenSchema)

/**
 * Identity function for RebillyPaymentAuthorizationToken payload with sources
 */
export const isRebillyPaymentAuthorizationTokenWithSources = isPayloadOfSchemaTypeWithSources<RebillyPaymentAuthorizationToken>(
  RebillyPaymentAuthorizationTokenSchema,
)

/**
 * Identity function for RebillyPaymentAuthorizationToken payload with meta
 */
export const isRebillyPaymentAuthorizationTokenWithMeta = isPayloadOfSchemaTypeWithMeta<RebillyPaymentAuthorizationToken>(
  RebillyPaymentAuthorizationTokenSchema,
)
