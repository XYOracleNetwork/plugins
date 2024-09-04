import { assertEx } from '@xylabs/assert'
import { isHash } from '@xylabs/hex'
import type { Promisable } from '@xylabs/promise'
import { DisallowedModuleIdentifierCharacters } from '@xyo-network/module-model'
import type { Payload } from '@xyo-network/payload-model'
import type { DomainFields, TopLevelDomain } from '@xyo-network/xns-record-payload-plugins'
import { DomainSchema } from '@xyo-network/xns-record-payload-plugins'

import { XnsNamePublicValidators } from '../validation/index.ts'

export type ValidSourceTypes = 'xnsName' | 'hash' | null

// Escaping special regex characters in the disallowed keys
const escapeRegex = (str: string) => str.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)

// Escaping and then creating the regex
const disallowedCharsPattern = Object.keys(DisallowedModuleIdentifierCharacters)
  .map(escapeRegex)
  .join('')
// Creating the final regex
const REMOVE_DISALLOWED_CHARS = new RegExp(`[${disallowedCharsPattern}]`, 'g')

export class XnsNameHelper {
  static ValidTLDs = ['.xyo'] as const

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

  static isValid(domain: Payload<DomainFields>) {
    return XnsNamePublicValidators.every(validator => validator(domain))
  }

  /**
   * Mask a string to be a valid XNS name
   * @param {string} str
   * @returns string
   */
  static mask(str: string) {
    // convert to lowercase
    const lowercaseXnsName = str.toLowerCase()

    // Remove everything except letters, numbers, and dashes
    let formattedXnsName = lowercaseXnsName.replaceAll(/[^\dA-Za-z-]+$/g, '')

    // Remove leading and trailing dashes
    formattedXnsName = formattedXnsName.replaceAll(/^-+|-+$/g, '')

    // Filter out disallowed characters.
    // NOTE: not necessary because of the regex/replacement above, but leaving for when certain special characters become allowed
    formattedXnsName = formattedXnsName.replaceAll(REMOVE_DISALLOWED_CHARS, '')

    return formattedXnsName
  }
}
