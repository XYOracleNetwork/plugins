import { AbstractWitness } from '@xyo-network/abstract-witness'
import { BowserSystemInfoSchema } from '@xyo-network/bowser-system-info-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessModule, WitnessParams } from '@xyo-network/witness-model'
import Bowser from 'bowser'

import type { BowserSystemInfoWitnessConfig } from './Config.ts'
import { BowserSystemInfoWitnessConfigSchema } from './Config.ts'

export type BowserSystemInfoWitnessParams = WitnessParams<AnyConfigSchema<BowserSystemInfoWitnessConfig>>
export class BowserSystemInfoWitness<TParams extends BowserSystemInfoWitnessParams = BowserSystemInfoWitnessParams>
  extends AbstractWitness<TParams>
  implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, BowserSystemInfoWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = BowserSystemInfoWitnessConfigSchema

  protected get bowser() {
    return Bowser.parse(globalThis.navigator.userAgent)
  }

  protected override observeHandler(payloads?: Payload[]) {
    return [{
      bowser: this.bowser, ...payloads?.[0], schema: BowserSystemInfoSchema,
    }]
  }
}
