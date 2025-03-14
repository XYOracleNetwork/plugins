import type { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { DomainSchema } from '@xyo-network/domain-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessModule, WitnessParams } from '@xyo-network/witness-model'

import type { DomainWitnessConfig } from './Config.ts'
import { DomainWitnessConfigSchema } from './Config.ts'

export type DomainWitnessParams = WitnessParams<AnyConfigSchema<DomainWitnessConfig>>
export class DomainWitness<TParams extends DomainWitnessParams = DomainWitnessParams> extends AbstractWitness<TParams> implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, DomainWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = DomainWitnessConfigSchema
  static readonly dmarc = '_xyo'

  static generateDmarc(domain: string) {
    return `${DomainWitness.dmarc}.${domain}`
  }

  protected override observeHandler(_payload?: Payload[]): Promisable<Payload[]> {
    return [{ schema: DomainSchema }]
  }
}
