import type { ModuleIdentifier } from '@xyo-network/module-model'
import type { WitnessConfig } from '@xyo-network/witness-model'

import type { DNSResourceRecordType } from '../types/index.ts'
import { DNSSchema } from './Schema.ts'

export type DNSWitnessConfigSchema = `${DNSSchema}.witness.config`
export const DNSWitnessConfigSchema: DNSWitnessConfigSchema = `${DNSSchema}.witness.config`

export type DNSWitnessConfig = WitnessConfig<{
  /**
   * The domain lease registrant diviner to be used to determine the domain lease registrant
   * for XNS domains
   */
  domainLeaseRegistrantDiviner?: ModuleIdentifier
  /**
   * The config schema for the DNS witness
   */
  schema: DNSWitnessConfigSchema
  /**
   * If supplied, the DNS witness will only support the specified resource record types
   */
  supportedResources?: DNSResourceRecordType[]
}>
