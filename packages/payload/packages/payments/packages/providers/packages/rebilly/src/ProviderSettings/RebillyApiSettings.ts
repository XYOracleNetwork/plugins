export interface RebillyApiDomainSettings {
  /**
   * The Rebilly domain (https://api-sandbox.rebilly.com, https://api.rebilly.com)
   */
  domain: 'https://api-sandbox.rebilly.com' | 'https://api.rebilly.com'
}

export interface RebillyApiKeySettings extends RebillyApiDomainSettings {
  /*
   * The Rebilly API key
   */
  apiKey: string
}
export interface RebillyApiSettings extends RebillyApiDomainSettings, RebillyApiKeySettings {}

export interface RebillyPublishableApiKeySettings extends RebillyApiDomainSettings {
  /*
   * The Rebilly Publishable API key
   */
  publishableApiKey: string
}

export interface RebillyPublishableApiSettings extends RebillyApiDomainSettings, RebillyPublishableApiKeySettings {}
