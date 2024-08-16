import type { RebillyApiDomainSettings } from '@xyo-network/rebilly-payment-payload-plugin'
import type { SentinelConfig } from '@xyo-network/sentinel-model'

import { RebillyPaymentCardAuthorizationSentinelSchema } from './Schema.ts'

export const RebillyPaymentCardAuthorizationSentinelConfigSchema = `${RebillyPaymentCardAuthorizationSentinelSchema}.config`
export type RebillyPaymentCardAuthorizationSentinelConfigSchema = typeof RebillyPaymentCardAuthorizationSentinelConfigSchema

/*
 * The Rebilly Payment Card Authorization Sentinel Config
 */
export type RebillyPaymentCardAuthorizationSentinelConfig = SentinelConfig<{
  /**
   * The config schema
   */
  schema: RebillyPaymentCardAuthorizationSentinelConfigSchema
}> &
Partial<RebillyApiDomainSettings>
