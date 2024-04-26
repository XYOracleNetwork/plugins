import { AnyConfigSchema } from '@xyo-network/module-model'
import { SentinelParams } from '@xyo-network/sentinel-model'

import { RebillyOrganizationSettings, RebillyPublishableApiSettings } from '../../../../../RebillyProviderSettings'
import { RebillyPaymentCardAuthorizationSentinelConfig } from './Config'

export type RebillyPaymentCardAuthorizationParams = Partial<RebillyPublishableApiSettings & RebillyOrganizationSettings>

export type RebillyPaymentCardAuthorizationSentinelParams<
  TConfig extends AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig> = AnyConfigSchema<RebillyPaymentCardAuthorizationSentinelConfig>,
  TParams extends RebillyPaymentCardAuthorizationParams = RebillyPaymentCardAuthorizationParams,
> = SentinelParams<TConfig, TParams>
