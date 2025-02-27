import {
  isPayloadOfSchemaType, isPayloadOfSchemaTypeWithSources, Payload,
} from '@xyo-network/payload-model'

import { SignatureSchema } from './Schema.ts'

// TODO: Overlap of outputs from:
// openssl list -digest-algorithms
// AND
// inputs to node.js crypto.createHash
export type Digest = 'sha512' | 'sha3-256'

export interface SignatureFields {
  /**
   * The digest algorithm used to create the signature
   */
  digestAlgorithm: Digest
  /**
   * The signature
   */
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
