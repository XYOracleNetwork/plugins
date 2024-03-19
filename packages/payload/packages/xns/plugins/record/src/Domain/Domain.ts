import { Payload } from '@xyo-network/payload-model'

export type DomainSchema = 'network.xyo.ns.domain'
export const DomainSchema: DomainSchema = 'network.xyo.ns.domain'

export interface DomainFields {
  /**
   * The XNS domain of the record
   */
  domain: string
}

/**
 * A domain record is a record of a domain
 */
export type Domain = Payload<DomainFields, DomainSchema>
