import type { Address } from '@xylabs/hex'
import type { Payload } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import type { DomainFields } from '../Domain/index.ts'
import { DomainSchema } from '../Domain/index.ts'

export const DomainRegistrationSchema = `${DomainSchema}.registration` as const
export type DomainRegistrationSchema = typeof DomainRegistrationSchema

export interface DomainRegistrationFields extends DomainFields {
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
 * Delegation of a domain to a registrar by a registrant
 */
export type DomainRegistration = Payload<DomainRegistrationFields, DomainRegistrationSchema>

/**
 * Identity function for DomainRegistration payload
 */
export const isDomainRegistration = isPayloadOfSchemaType<DomainRegistration>(DomainRegistrationSchema)

/**
 * Identity function for DomainRegistration payload with sources
 */
export const isDomainRegistrationWithSources = isPayloadOfSchemaTypeWithSources<DomainRegistration>(DomainRegistrationSchema)

/**
 * Identity function for DomainRegistration payload with meta
 */
export const isDomainRegistrationWithMeta = isPayloadOfSchemaTypeWithMeta<DomainRegistration>(DomainRegistrationSchema)
