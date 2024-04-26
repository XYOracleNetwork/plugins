import { AnyConfigSchema } from '@xyo-network/module-model'
import { RebillyOrganizationSettings, RebillyPublishableApiSettings } from '@xyo-network/rebilly-payment-payload-plugin'
import { SentinelParams } from '@xyo-network/sentinel-model'

import { RebillyPaymentCardAuthorizationSentinelConfig } from './Config'

export type RebillyPaymentCardAuthorizationParams = Partial<RebillyPublishableApiSettings & RebillyOrganizationSettings>

export type RebillyPaymentCardAuthorizationSentinelParams<
  TConfig extends AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig> = AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig>,
  TParams extends RebillyPaymentCardAuthorizationParams = RebillyPaymentCardAuthorizationParams,
> = SentinelParams<TConfig, TParams>
