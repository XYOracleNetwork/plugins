import type { ModuleIdentifier } from '@xyo-network/module-model'
import { asSchema } from '@xyo-network/payload-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type { DNSResourceRecordType } from '../types/index.ts'
import { DNSSchema } from './Schema.ts'

export type DNSWitnessConfigSchema = typeof DNSWitnessConfigSchema
export const DNSWitnessConfigSchema = asSchema(`${DNSSchema}.witness.config`, true)

export type DNSWitnessConfig = WitnessConfig<{
  /**
   * The address record index diviner to be used to determine the address record index
   */
  addressRecordIndexDiviner?: ModuleIdentifier
  /**
   * The hash record index diviner to be used to determine the hash record index
   */
  hashRecordIndexDiviner?: ModuleIdentifier
  /**
   * The config schema for the DNS witness
   */
  schema: DNSWitnessConfigSchema
  /**
   * If supplied, the DNS witness will only support the specified resource record types
   */
  supportedResources?: DNSResourceRecordType[]
}>
