import type { Hash } from '@xylabs/hex'
import type { PayloadWithSources } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'

import { EscrowSchema } from './Schema.ts'

export const EscrowOutcomeSchema = `${EscrowSchema}.outcome` as const
export type EscrowOutcomeSchema = typeof EscrowOutcomeSchema

/**
 * The possible outcomes for an escrow
 */
export type EscrowOutcomes = 'fulfilled' | 'expired' // TODO: More outcomes

export interface EscrowOutcomeFields {
  outcome: EscrowOutcomes
  terms: Hash
}

/**
 * The terms of an escrow
 */
export type EscrowOutcome = PayloadWithSources<EscrowOutcomeFields, EscrowOutcomeSchema>

/**
 * Identity function for determining if an object is an EscrowOutcome
 */
export const isEscrowOutcome = isPayloadOfSchemaType<EscrowOutcome>(EscrowOutcomeSchema)

/**
 * Identity function for determining if an object is an EscrowOutcome with sources
 */
export const isEscrowOutcomeWithSources = isPayloadOfSchemaTypeWithSources<EscrowOutcome>(EscrowOutcomeSchema)
