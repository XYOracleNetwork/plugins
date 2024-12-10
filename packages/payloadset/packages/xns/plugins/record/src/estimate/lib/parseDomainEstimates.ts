import { exists } from '@xylabs/exists'
import { type BoundWitness, isBoundWitness } from '@xyo-network/boundwitness-model'
import {
  type HashLeaseEstimate, HashLeaseEstimateSchema,
  isHashLeaseEstimate,
} from '@xyo-network/diviner-hash-lease'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, WithSources } from '@xyo-network/payload-model'
import {
  type DomainEstimate,
  type DomainRegistrationLease, DomainRegistrationLeaseSchema, isDomainRegistrationLease,
} from '@xyo-network/xns-record-payload-plugins'

/**
 * Parses a generic array of payloads into estimates
 * @param payloads An array of payloads
 * @returns Parsed estimates
 */
export const parseDomainEstimates = async (payloads?: Payload[]): Promise<DomainEstimate[]> => {
  if (!payloads) return []
  const bws = payloads
    // Find all bound witnesses
    .filter(isBoundWitness)
    // that have the required estimate payloads
    .filter(hasEstimatePayloads) ?? []
  if (bws.length === 0) return []
  const hashMap = await PayloadBuilder.toAllHashMap(payloads)
  return bws.map<DomainEstimate | undefined>((bw) => {
    const hashLeaseEstimate = getPayloadBySchemaFromBoundWitness<WithSources<HashLeaseEstimate>>(
      bw,
      HashLeaseEstimateSchema,
      hashMap,
      isHashLeaseEstimate,
    )
    if (!hashLeaseEstimate) return
    const domainLease = getPayloadBySchemaFromBoundWitness<DomainRegistrationLease>(
      bw,
      DomainRegistrationLeaseSchema,
      hashMap,
      isDomainRegistrationLease,
    )
    if (!domainLease) return
    return [bw, hashLeaseEstimate, domainLease]
  }).filter(exists)
}

/**
 * Tests if a BoundWitness has the required estimate payloads
 * @param bw The BoundWitness to check for estimate payloads
 * @returns True if the BoundWitness has the required estimate payloads, false otherwise
 */
const hasEstimatePayloads = (bw: BoundWitness): boolean => {
  return bw.payload_schemas.includes(DomainRegistrationLeaseSchema)
    && bw.payload_schemas.includes(HashLeaseEstimateSchema)
}

/**
 * Finds the first instance of a payload in a BoundWitness by schema
 * @param bw The BoundWitness to extract the payload from
 * @param schema The schema of the payload to extract
 * @param hashMap The hashmap of the payloads
 * @param identity An identity function to check if the payload is of the correct type
 * @returns The payload if it exists or undefined
 */
const getPayloadBySchemaFromBoundWitness = <T extends Payload = Payload>(
  bw: BoundWitness,
  schema: string,
  hashMap: Awaited<ReturnType<typeof PayloadBuilder.toHashMap>>,
  identity: (payload: Payload) => payload is T,
): T | undefined => {
  const schemaIndex = bw.payload_schemas.indexOf(schema)
  if (schemaIndex === -1) return
  const hash = bw.payload_hashes[schemaIndex]
  return [hashMap[hash]].filter(exists).find(identity)
}
