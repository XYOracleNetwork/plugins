import type { Payload } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { SignatureSchema } from './Schema.ts'

// TODO: openssl list -digest-algorithms
export type Digest = 'sha512' | 'sha3-256'

export interface SignatureFields {
  digestAlgorithm: Digest
  signature: string
}

/**
 * A Signature Payload
 */
export type Signature = Payload<SignatureFields, SignatureSchema>

/**
 * Identity function for determine if an object is a Signature
 */
export const isSignature = isPayloadOfSchemaType<Signature>(SignatureSchema)

/**
 * Identity function for determine if an object is a Signature with sources
 */
export const isSignatureWithSources = isPayloadOfSchemaTypeWithSources<Signature>(SignatureSchema)

/**
 * Identity function for determine if an object is a Signature with meta
 */
export const isSignatureWithMeta = isPayloadOfSchemaTypeWithMeta<Signature>(SignatureSchema)
