import { SentinelConfig } from '@xyo-network/sentinel-model'

import { OrderPostRequest } from '../../../../../../api'
import { RebillyApiDomainSettings } from '../../../../../RebillyProviderSettings'
import { RebillyPaymentCardAuthorizationSentinelSchema } from './Schema'

export const RebillyPaymentCardAuthorizationSentinelConfigSchema = `${RebillyPaymentCardAuthorizationSentinelSchema}.config`
export type RebillyPaymentCardAuthorizationSentinelConfigSchema = typeof RebillyPaymentCardAuthorizationSentinelConfigSchema

/*
 * The Rebilly Payment Card Authorization Sentinel Config
 */
export type RebillyPaymentCardAuthorizationSentinelConfig = SentinelConfig<{
  requestDefaults?: Partial<OrderPostRequest>
  /**
   * The config schema
   */
  schema: RebillyPaymentCardAuthorizationSentinelConfigSchema
}> &
  Partial<RebillyApiDomainSettings>
