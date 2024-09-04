import { assertEx } from '@xylabs/assert'
import { isHash } from '@xylabs/hex'
import type { Promisable } from '@xylabs/promise'
import { DisallowedModuleIdentifierCharacters } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'

import type { DomainRegistration } from '../../DomainRegistration/index.ts'
import { DomainRegistrationSchema } from '../../DomainRegistration/index.ts'
import { XnsNamePublicValidators } from '../validation/index.ts'

export type ValidSourceTypes = 'xnsName' | 'hash' | null

export class XnsNameHelper {
  static ValidTLDs = ['.xyo'] as const

  private _xnsName: DomainRegistration

  private constructor(xnsName: DomainRegistration) {
    this._xnsName = xnsName
  }

  get domain() {
    return assertEx(this.xnsName.domain, () => 'domain not found in payload')
  }

  get tld() {
    return assertEx(this.xnsName.tld, () => 'tld not found in payload')
  }

  get xnsName() {
    return assertEx(this._xnsName, () => 'XnsNameHelper xnsName not set')
  }

  /**
   * Create an XnsNameHelper from a domain registration payload
   * @param  {DomainRegistration} domainRegistration
   * @returns Promise<XnsNameHelper>
   */
  static fromPayload(domainRegistration: DomainRegistration): Promisable<XnsNameHelper> {
    return new XnsNameHelper(domainRegistration)
  }

  /**
   * Create an XnsNameHelper from a string
   * @param  {string} xnsName
   * @returns Promise<XnsNameHelper>
   */
  static async fromString(xnsName: string): Promise<XnsNameHelper> {
    const parts = xnsName.split('.')
    assertEx(parts.length === 2, () => 'Unable to parse xnsName')

    const domain = parts[0]
    const tld = parts[1] as 'xyo'
    const domainRegistration: DomainRegistration = {
      schema: DomainRegistrationSchema, domain, tld, registrant: [], registrar: [],
    }
    const payload = await PayloadBuilder.build(domainRegistration)

    return new XnsNameHelper(payload)
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

  static isValid(domainRegistration: DomainRegistration) {
    return XnsNamePublicValidators.every(validator => validator(domainRegistration))
  }

  /**
   * Mask a string to be a valid XNS name
   * @param {string} str
   * @returns string
   */
  static mask(str: string) {
    // convert to lowercase
    const lowercaseXnsName = str.toLowerCase()

    // remove everything except letters, numbers, and dashes
    let formattedXnsName = lowercaseXnsName.replaceAll(/[^\dA-Za-z-]+$/g, '')

    // remove leading and trailing dashes
    formattedXnsName = formattedXnsName.replaceAll(/^-+|-+$/g, '')

    // Filter out disallowed characters.
    // NOTE: not necessary because of the regex/replacement above, but leaving for when certain special characters become allowed
    for (const char of Object.keys(DisallowedModuleIdentifierCharacters)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      formattedXnsName.includes(char) ? (formattedXnsName = formattedXnsName.replaceAll(char, '')) : formattedXnsName
    }

    return formattedXnsName
  }
}
