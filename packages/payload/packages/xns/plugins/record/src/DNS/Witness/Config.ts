import { ModuleIdentifier } from '@xyo-network/module-model'
import { WitnessConfig } from '@xyo-network/witness-model'

import { DNSResourceRecordType } from '../types/index.ts'
import { DNSSchema } from './Schema.ts'

export type DNSWitnessConfigSchema = `${DNSSchema}.witness.config`
export const DNSWitnessConfigSchema: DNSWitnessConfigSchema = `${DNSSchema}.witness.config`

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
