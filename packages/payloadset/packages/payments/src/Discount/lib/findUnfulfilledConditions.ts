import type { Hash } from '@xylabs/hex'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, WithMeta } from '@xyo-network/payload-model'
import type { Coupon } from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import { isSchemaPayloadWithMeta } from '@xyo-network/schema-payload-plugin'
import type { ValidateFunction } from 'ajv'
import { Ajv } from 'ajv'

// TODO: Use our schema cache
const ajv = new Ajv({ strict: false }) // Create the Ajv instance once
const schemaCache = new Map() // Cache to store compiled validators

export const areConditionsFulfilled = async (coupon: Coupon, payloads: Payload[]): Promise<boolean> =>
  (await findUnfulfilledConditions(coupon, payloads)).length === 0

// TODO: Should we separate conditions and payloads to prevent conflating data and "operands" (schemas to validate against data)?
/**
 * Validates the conditions of a coupon against the provided payloads
 * @param coupon The coupon to check
 * @param payloads The associated payloads (containing the conditions and data to validate the conditions against)
 * @returns The unfulfilled condition hashes
 */
export const findUnfulfilledConditions = async (coupon: Coupon, payloads: Payload[]): Promise<Hash[]> => {
  const unfulfilledConditions: Hash[] = []
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return unfulfilledConditions
  const hashMap = await PayloadBuilder.toAllHashMap(payloads)
  // Find all the conditions
  const conditions = coupon.conditions.map(hash => hashMap[hash]).filter(isSchemaPayloadWithMeta) as WithMeta<SchemaPayload>[]
  // Not all conditions were found
  if (conditions.length !== coupon.conditions.length) {
    const missing = coupon.conditions.filter(hash => !hashMap[hash])
    unfulfilledConditions.push(...missing)
    return unfulfilledConditions
  }

  // Test each condition
  for (const hash of coupon.conditions) {
    let validator: ValidateFunction

    // Check if the schema is already cached
    if (schemaCache.has(hash)) {
      validator = schemaCache.get(hash)
    } else {
      const payload = hashMap[hash]
      const definition = isSchemaPayloadWithMeta(payload) ? payload.definition : undefined
      if (definition) {
        // Compile and cache the validator
        validator = ajv.compile(definition)
        schemaCache.set(hash, validator)

        // Validate the payload
        if (!validator(payloads)) unfulfilledConditions.push(payload.$hash)
      } else {
        unfulfilledConditions.push(hash)
        continue
      }
    }
  }

  // All conditions passed
  return unfulfilledConditions
}
