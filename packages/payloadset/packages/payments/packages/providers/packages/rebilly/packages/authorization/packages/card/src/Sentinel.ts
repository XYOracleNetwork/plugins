import { assertEx } from '@xylabs/assert'
import { AxiosJson, AxiosRequestConfig, HttpStatusCode } from '@xylabs/axios'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, WithSources } from '@xyo-network/payload-model'
import { isBillingAddress, isPaymentCard } from '@xyo-network/payment-payload-plugins'
import { RebillyPaymentAuthorizationToken, RebillyPaymentAuthorizationTokenSchema } from '@xyo-network/rebilly-payment-payload-plugin'
import { AbstractSentinel } from '@xyo-network/sentinel-abstract'
import { SentinelInstance, SentinelModuleEventData } from '@xyo-network/sentinel-model'

import { CreateTokenResponse } from './Api/index.ts'
import { RebillyPaymentCardAuthorizationSentinelConfigSchema } from './Config.ts'
import { RebillyPaymentCardAuthorizationSentinelParams } from './Params.ts'
import { toTokenRequest } from './util/index.ts'

const removePrefix = (str: string, prefix: string) => {
  const regex = new RegExp(`^${prefix}`)
  return str.replace(regex, '')
}

const moduleName = 'RebillyPaymentCardAuthorizationSentinel'
export class RebillyPaymentCardAuthorizationSentinel<
  TParams extends RebillyPaymentCardAuthorizationSentinelParams = RebillyPaymentCardAuthorizationSentinelParams,
  TEventData extends SentinelModuleEventData<SentinelInstance<TParams>> = SentinelModuleEventData<SentinelInstance<TParams>>,
> extends AbstractSentinel<TParams, TEventData> {
  static override configSchemas = [RebillyPaymentCardAuthorizationSentinelConfigSchema]
  static override defaultConfigSchema = RebillyPaymentCardAuthorizationSentinelConfigSchema

  protected _apiRoot: string | undefined = undefined
  protected _domain: string | undefined = undefined
  protected _headers: AxiosRequestConfig['headers'] | undefined = undefined
  protected _organizationId: string | undefined = undefined
  protected _publishableApiKey: string | undefined = undefined
  protected _tokenEndpoint: string | undefined = undefined

  /**
   * The Rebilly Organization API root endpoint
   */
  protected get apiRoot() {
    if (!this._apiRoot) this._apiRoot = `${this.domain}/organizations/${this.organizationId}`
    return this._apiRoot
  }

  /**
   * The Rebilly domain
   */
  protected get domain() {
    if (!this._domain) this._domain = assertEx(this.params.domain ?? this.config.domain, () => `${moduleName}: Missing domain in params/config`)
    return this._domain
  }

  /**
   * The headers to be included in the request for each request
   */
  protected get headers(): AxiosRequestConfig['headers'] {
    if (!this._headers) this._headers = { Authorization: this.publishableApiKey }
    return this._headers
  }

  /**
   * True if the environment is sandbox (testing), false otherwise
   */
  protected get isSandboxEnvironment(): boolean {
    return this.domain.includes('sandbox')
  }

  /**
   * The Rebilly organization ID
   */
  protected get organizationId() {
    if (!this._organizationId)
      this._organizationId = removePrefix(
        assertEx(this.params.organizationId, () => `${moduleName}: Missing organizationId in params`),
        'org_',
      )
    return this._organizationId
  }

  /**
   * The Rebilly Publishable API key
   */
  protected get publishableApiKey(): string {
    if (!this._publishableApiKey)
      this._publishableApiKey = assertEx(this.params.publishableApiKey, () => `${moduleName}: Missing publishableApiKey in params`)
    return this._publishableApiKey
  }

  /**
   * The Rebilly Organization token creation endpoint
   */
  protected get tokenEndpoint() {
    if (!this._tokenEndpoint) this._tokenEndpoint = `${this.apiRoot}/tokens`
    return this._tokenEndpoint
  }

  override async reportHandler(payloads?: Payload[]): Promise<Payload[]> {
    await this.started('throw')
    const results: WithSources<RebillyPaymentAuthorizationToken>[] = []
    // Verify necessary inputs and if nothing meets our criteria, bail early
    if (!payloads || payloads.length === 0) return results
    const paymentCard = payloads?.find(isPaymentCard)
    if (!paymentCard) return results
    const billingAddress = payloads?.find(isBillingAddress)
    if (!billingAddress) return results
    const axios = new AxiosJson({ headers: this.headers })
    try {
      const data = toTokenRequest(paymentCard, billingAddress)
      const response = await axios.post<CreateTokenResponse>(this.tokenEndpoint, data)
      assertEx(response.status === HttpStatusCode.Created, () => `Failed to tokenize payment card: ${response.status}`)
      const { id } = response.data
      const sources = await PayloadBuilder.dataHashes([paymentCard, billingAddress])
      results.push({ id, schema: RebillyPaymentAuthorizationTokenSchema, sources })
    } catch (error) {
      this.logger?.error?.(`${moduleName}: Error creating payment token: ${error}`)
    }
    return results
  }
}
