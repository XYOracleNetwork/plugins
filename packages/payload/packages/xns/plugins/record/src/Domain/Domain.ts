import { AsObjectFactory } from '@xylabs/object'
import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources, Payload, WithSources,
} from '@xyo-network/payload-model'

export type DomainSchema = 'network.xyo.ns.domain'
export const DomainSchema: DomainSchema = 'network.xyo.ns.domain'

/**
 * The supported TLDs for XNS
 */
export type TopLevelDomain = 'xyo'

/**
 * The fields for a domain record
 */
export interface DomainFields {
  /**
   * The XNS domain of the record
   */
  domain: string

  /**
   * The Top-Level Domain of the domain
   */
  tld: TopLevelDomain
}

/**
 * A domain record is a record of a domain
 */
export type Domain = Payload<DomainFields, DomainSchema>

/**
 * Identity function for Domain payload
 */
export const isDomain = isPayloadOfSchemaType<Domain>(DomainSchema)
export const asDomain = AsObjectFactory.create<Domain>(isDomain)
export const asOptionalDomain = AsObjectFactory.createOptional<Domain>(isDomain)

/**
 * Identity function for Domain payload with sources
 */
export const isDomainWithSources = isPayloadOfSchemaTypeWithSources<WithSources<Domain>>(DomainSchema)
export const asDomainWithSources = AsObjectFactory.create<WithSources<Domain>>(isDomainWithSources)
export const asOptionalDomainWithSources = AsObjectFactory.createOptional<WithSources<Domain>>(isDomainWithSources)
