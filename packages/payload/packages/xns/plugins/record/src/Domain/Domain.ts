import { isPayloadOfSchemaType, Payload } from '@xyo-network/payload-model'

export type DomainSchema = 'network.xyo.ns.domain'
export const DomainSchema: DomainSchema = 'network.xyo.ns.domain'

/**
 * The supported TLDs for XNS
 */
export type SupportedTld = 'xyo'

/**
 * The fields for a domain record
 */
export interface DomainFields {
  /**
   * The XNS domain of the record
   */
  domain: string

  /**
   * The TLD of the domain
   */
  tld: SupportedTld
}

/**
 * A domain record is a record of a domain
 */
export type Domain = Payload<DomainFields, DomainSchema>

/**
 * Identity function for Domain payload
 */
export const isDomain = isPayloadOfSchemaType<Domain>(DomainSchema)
