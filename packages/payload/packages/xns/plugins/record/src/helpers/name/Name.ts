import { assertEx } from '@xylabs/assert'
import { isHash } from '@xylabs/hex'
import type { Promisable } from '@xylabs/promise'
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

  static fromPayload(domainRegistration: DomainRegistration): Promisable<XnsNameHelper> {
    return new XnsNameHelper(domainRegistration)
  }

  static async fromString(xnsName: string) {
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

  static isValid(domainRegistration: DomainRegistration) {
    return XnsNamePublicValidators.every(validator => validator(domainRegistration))
  }

  static isXnsNameOrHash(source?: string): ValidSourceTypes {
    const xnsName = XnsNameHelper.ValidTLDs.some(tld => source?.endsWith(tld)) ? source : null
    const hash = isHash(source) ? source : null

    return xnsName ? 'xnsName' : hash ? 'hash' : null
  }
}
