import { Address } from '@xylabs/hex'
import { Payload } from '@xyo-network/payload-model'

import { DomainLeaseFields, DomainSchema } from '../Domain'

export const DomainRegistrationSchema = `${DomainSchema}.registration` as const
export type DomainRegistrationSchema = typeof DomainRegistrationSchema

export interface DomainRegistrationFields extends DomainLeaseFields {
  /**
   * The registrant of the domain
   */
  registrant: Address[]
  /**
   * The registrar of the domain
   */
  registrar: Address[]
}

/**
 * A WHOIS record is a record of a domain identifying its registrant, registrar and nameservers
 */
export type DomainRegistration = Payload<DomainRegistrationFields, DomainRegistrationSchema>
