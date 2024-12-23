import { AsObjectFactory } from '@xylabs/object'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

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
export const asRebillyPaymentAuthorizationToken = AsObjectFactory.create<RebillyPaymentAuthorizationToken>(isRebillyPaymentAuthorizationToken)
export const asOptionalRebillyPaymentAuthorizationToken = AsObjectFactory.createOptional<RebillyPaymentAuthorizationToken>(isRebillyPaymentAuthorizationToken)

/**
 * Identity function for RebillyPaymentAuthorizationToken payload with sources
 */
export const isRebillyPaymentAuthorizationTokenWithSources = isPayloadOfSchemaTypeWithSources<RebillyPaymentAuthorizationToken>(
  RebillyPaymentAuthorizationTokenSchema,
)
export const asRebillyPaymentAuthorizationTokenWithSources = AsObjectFactory
  .create<WithSources<RebillyPaymentAuthorizationToken>>(isRebillyPaymentAuthorizationTokenWithSources)
export const asOptionalRebillyPaymentAuthorizationTokenWithSources = AsObjectFactory
  .createOptional<WithSources<RebillyPaymentAuthorizationToken>>(isRebillyPaymentAuthorizationTokenWithSources)
