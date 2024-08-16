import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources } from '@xyo-network/payload-model'

import { BillingAddressSchema } from './Schema.ts'

/**
 * The fields describing a billing address.
 */
export interface BillingAddressFields {
  /** Street address line 1. */
  address?: string
  /** Street address line 2. */
  address2?: string | null
  /** City of the billing address. */
  city?: string
  /** Country code of the billing address, ISO 3166-1 alpha-2 code. */
  country?: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Organization or company name associated with the billing address. */
  organization?: string | null
  /** Postal or ZIP code of the billing address. */
  postalCode?: string
  /** State or region of the billing address. */
  region?: string
}

/**
 * A BillingAddress Payload
 */
export type BillingAddress = Payload<BillingAddressFields, BillingAddressSchema>

/**
 * Identity function for determine if an object is a BillingAddress
 */
export const isBillingAddress = isPayloadOfSchemaType<BillingAddress>(BillingAddressSchema)

/**
 * Identity function for determine if an object is a BillingAddress with sources
 */
export const isBillingAddressWithSources = isPayloadOfSchemaTypeWithSources<BillingAddress>(BillingAddressSchema)

/**
 * Identity function for determine if an object is a BillingAddress with meta
 */
export const isBillingAddressWithMeta = isPayloadOfSchemaTypeWithMeta<BillingAddress>(BillingAddressSchema)
