import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { RebillyOrganizationSettings, RebillyPublishableApiSettings } from '@xyo-network/rebilly-payment-payload-plugin'
import type { SentinelParams } from '@xyo-network/sentinel-model'

import type { RebillyPaymentCardAuthorizationSentinelConfig } from './Config.ts'

export type RebillyPaymentCardAuthorizationParams = Partial<RebillyPublishableApiSettings & RebillyOrganizationSettings>

export interface RebillyPaymentCardAuthorizationSentinelParams<
  TConfig extends AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig> = AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig>,
> extends SentinelParams<TConfig> {
  domain?: string
  organizationId?: string
  publishableApiKey?: string
}
