import { assertEx } from '@xylabs/assert'
import type { Hash } from '@xylabs/hex'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, WithMeta } from '@xyo-network/payload-model'
import {
  isPayloadOfSchemaType,
  isPayloadOfSchemaTypeWithMeta,
  isPayloadOfSchemaTypeWithSources,
} from '@xyo-network/payload-model'
import type { Coupon } from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import { SchemaSchema } from '@xyo-network/schema-payload-plugin'
import type { ValidateFunction } from 'ajv'
import { Ajv } from 'ajv'

// TODO: Use our schema cache
const ajv = new Ajv({ strict: false }) // Create the Ajv instance once
const schemaCache = new Map() // Cache to store compiled validators

// TODO: Migrate to and pull from core SDK
/**
 * Identity function for determining if an object is an Schema
 */
export const isSchema = isPayloadOfSchemaType<SchemaPayload>(SchemaSchema)

/**
 * Identity function for determining if an object is an Schema with sources
 */
export const isSchemaWithSources = isPayloadOfSchemaTypeWithSources<SchemaPayload>(SchemaSchema)

/**
 * Identity function for determining if an object is an Schema with meta
 */
export const isSchemaWithMeta = isPayloadOfSchemaTypeWithMeta<SchemaPayload>(SchemaSchema)

export const areConditionsFulfilled = async (coupon: Coupon, payloads: Payload[]): Promise<boolean> => {
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return true
  const hashMap = await PayloadBuilder.toAllHashMap(payloads)
  // Find all the conditions
  const conditions = coupon.conditions.map(hash => hashMap[hash]).filter(isSchemaWithMeta) as WithMeta<SchemaPayload>[]
  assertEx(conditions.length === coupon.conditions.length, () => 'Not all conditions were found')

  // TODO: Compile all conditions and return array of failing conditions
  // Compile the conditions iteratively to allow for
  // bailing early if a condition is not met
  for (const payload of conditions) {
    const ajv = new Ajv({ strict: false })
    // check if it is a valid schema def
    const validator = ajv.compile(payload.definition)
    if (!validator(payloads)) return false
  }

  // All conditions passed
  return true
}

export const findUnfulfilledConditions = async (coupon: Coupon, payloads: Payload[]): Promise<Hash[]> => {
  const unfulfilledConditions: Hash[] = []
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return unfulfilledConditions
  const hashMap = await PayloadBuilder.toAllHashMap(payloads)
  // Find all the conditions
  const conditions = coupon.conditions.map(hash => hashMap[hash]).filter(isSchemaWithMeta) as WithMeta<SchemaPayload>[]
  // Not all conditions were found
  if (conditions.length !== coupon.conditions.length) {
    const missing = coupon.conditions.filter(hash => !hashMap[hash])
    unfulfilledConditions.push(...missing)
    return unfulfilledConditions
  }

  // Test each condition
  for (const payload of conditions) {
    let validator: ValidateFunction

    // Check if the schema is already cached
    if (schemaCache.has(payload.definition)) {
      validator = schemaCache.get(payload.definition)
    } else {
      // Compile and cache the validator
      validator = ajv.compile(payload.definition)
      schemaCache.set(payload.definition, validator)
    }

    // Validate the payload
    if (!validator(payloads)) unfulfilledConditions.push(payload.$hash)
  }

  // All conditions passed
  return unfulfilledConditions
}
