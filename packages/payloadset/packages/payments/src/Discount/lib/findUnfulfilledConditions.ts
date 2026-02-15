import type { Hash } from '@xylabs/sdk-js'
import type { Payload } from '@xyo-network/payload-model'
import type { Condition, Coupon } from '@xyo-network/payment-payload-plugins'
import { isCondition } from '@xyo-network/payment-payload-plugins'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import { isSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { PayloadBuilder } from '@xyo-network/sdk-js'
import type { ValidateFunction } from 'ajv'
import { Ajv } from 'ajv'

// TODO: Use our schema cache
const ajv = new Ajv({ strict: false }) // Create the Ajv instance once
const schemaCache = new Map() // Cache to store compiled validators

/**
 * Validates the conditions of a coupon against the provided payloads
 * @param coupon The coupon to check
 * @param conditions The conditions associated with the coupon
 * @param payloads The associated payloads (containing the conditions and data to validate the conditions against)
 * @returns True if all conditions are fulfilled, false otherwise
 */
export const areConditionsFulfilled = async (coupon: Coupon, conditions: Condition[] = [], payloads: Payload[] = []): Promise<boolean> =>
  (await findUnfulfilledConditions(coupon, conditions, payloads)).length === 0

/**
 * Validates the conditions of a coupon against the provided payloads
 * @param coupon The coupon to check
 * @param conditions The conditions associated with the coupon
 * @param payloads The associated payloads (containing the conditions and data to validate the conditions against)
 * @returns The unfulfilled condition hashes
 */
export const findUnfulfilledConditions = async (coupon: Coupon, conditions: Condition[] = [], payloads: Payload[] = []): Promise<Hash[]> => {
  const unfulfilledConditions: Hash[] = []
  // If there are no conditions, then they are fulfilled
  if (!coupon.conditions || coupon.conditions.length === 0) return unfulfilledConditions
  const hashMap = await PayloadBuilder.toAllHashMap([...conditions, ...payloads])
  // Find all the conditions
  const foundConditions = coupon.conditions.map(hash => hashMap[hash]).filter(isCondition)
  // Not all conditions were found
  if (foundConditions.length !== coupon.conditions.length) {
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
      const definition = isSchemaPayload(payload) ? (payload as SchemaPayload).definition : undefined
      if (definition) {
        // Compile and cache the validator
        validator = ajv.compile(definition)
        schemaCache.set(hash, validator)

        // Validate the payload
      } else {
        unfulfilledConditions.push(hash)
        continue
      }
    }
    if (!validator(payloads)) unfulfilledConditions.push(hash)
  }

  // All conditions passed
  return unfulfilledConditions
}
