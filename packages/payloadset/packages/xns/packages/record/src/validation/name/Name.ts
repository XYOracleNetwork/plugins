import { assertEx } from '@xylabs/assert'
import { isHash } from '@xylabs/hex'
import type { Promisable } from '@xylabs/promise'
import type { Payload } from '@xyo-network/payload-model'
import type { DomainFields, TopLevelDomain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH, XnsNameSimpleValidators } from '../validation/index.ts'
import { removeDisallowedCharacters } from './lib/index.ts'
import type { ValidSourceTypes } from './types/index.ts'

const defaultMaskOptions = { maskStartEndHyphens: false }

export class XnsNameHelper {
  static readonly ValidTLDs = ['.xyo'] as const

  private _xnsName: Payload<DomainFields>

  private constructor(xnsName: Payload<DomainFields>) {
    this._xnsName = xnsName
  }

  get domain() {
    return assertEx(this.xnsName.domain, () => 'domain not found in payload')
  }

  get name() {
    return `${this.domain}.${this.tld}`
  }

  get tld() {
    return assertEx(this.xnsName.tld, () => 'tld not found in payload')
  }

  get xnsName() {
    return assertEx(this._xnsName, () => 'XnsNameHelper xnsName not set')
  }

  /**
   * Create an XnsNameHelper from a domain payload
   * @param  {Domain} domain
   * @returns Promise<XnsNameHelper>
   */
  static fromPayload(domain: Payload<DomainFields>): Promisable<XnsNameHelper> {
    return new XnsNameHelper(domain)
  }

  /**
   * Create an XnsNameHelper from a string
   * @param  {string} xnsName
   * @returns Promise<XnsNameHelper>
   */
  static fromString(xnsName: string): XnsNameHelper {
    const parts = xnsName.split('.')
    assertEx(parts.length === 2, () => 'Unable to parse xnsName')

    const domain = parts[0]
    const tld = parts[1] as TopLevelDomain
    return new XnsNameHelper({
      schema: DomainSchema, domain, tld,
    })
  }

  /**
   * Determine if a string is a valid XNS name or hash
   * @param  {string} source?
   * @returns ValidSourceTypes
   */
  static isPotentialXnsNameOrHash(source?: string): ValidSourceTypes {
    if (isHash(source)) return 'hash'
    const xnsName = XnsNameHelper.ValidTLDs.some(tld => source?.endsWith(tld)) ? source : null
    return xnsName ? 'xnsName' : null
  }

  static async isValid(domain: Payload<DomainFields>): Promise<boolean> {
    const results = await Promise.all(XnsNameSimpleValidators.map(validator => validator(domain)))
    for (const result of results) {
      if (!result) return false
    }
    return true
  }

  /**
   * Mask a string to be a valid XNS name
   * @param {string} str
   * @returns string
   */
  static mask(str: string, options: { maskStartEndHyphens: boolean } = defaultMaskOptions): string {
    // Check if the domain name is too long
    if (str.length > MAX_DOMAIN_LENGTH) {
      throw new Error(`Domain name too long: ${str.length} exceeds max length: ${MAX_DOMAIN_LENGTH}`)
    }

    // convert to lowercase
    const lowercaseXnsName = str.toLowerCase()

    // Remove everything except letters, numbers, and dashes

    let formattedXnsName = lowercaseXnsName.replaceAll(/[^\dA-Za-z-]+$/g, '')

    // Remove leading and trailing dashes

    if (options.maskStartEndHyphens) formattedXnsName = formattedXnsName.replaceAll(/^-+|-+$/g, '')

    // Filter out disallowed characters.
    return removeDisallowedCharacters(formattedXnsName)
  }

  async validate(): Promise<[boolean, string[]]> {
    const errorMessages: string[] = []
    const onErrorsInternal = (message: string[]) => errorMessages.push(...message)

    for (const validator of XnsNameSimpleValidators) {
      await validator(this.xnsName, onErrorsInternal)
    }

    if (errorMessages.length > 0) {
      return [false, errorMessages]
    }

    return [true, []]
  }
}
