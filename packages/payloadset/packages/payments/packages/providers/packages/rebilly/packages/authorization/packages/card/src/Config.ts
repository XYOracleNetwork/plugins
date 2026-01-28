import { asSchema } from '@xyo-network/payload-model'
import type { RebillyApiDomainSettings } from '@xyo-network/rebilly-payment-payload-plugin'
import type { SentinelConfig } from '@xyo-network/sentinel-model'

import { RebillyPaymentCardAuthorizationSentinelSchema } from './Schema.ts'

export const RebillyPaymentCardAuthorizationSentinelConfigSchema = asSchema(`${RebillyPaymentCardAuthorizationSentinelSchema}.config`, true)
export type RebillyPaymentCardAuthorizationSentinelConfigSchema = typeof RebillyPaymentCardAuthorizationSentinelConfigSchema

/*
 * The Rebilly Payment Card Authorization Sentinel Config
 */
export interface RebillyPaymentCardAuthorizationSentinelConfig extends SentinelConfig<{
  /**
   * The config schema
   */
  schema: RebillyPaymentCardAuthorizationSentinelConfigSchema
}>, Partial<RebillyApiDomainSettings> {}
