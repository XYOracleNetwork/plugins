import { merge } from '@xylabs/lodash'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { BowserSystemInfoSchema } from '@xyo-network/bowser-system-info-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { WitnessModule, WitnessParams } from '@xyo-network/witness-model'
import Bowser from 'bowser'

import { BowserSystemInfoWitnessConfig, BowserSystemInfoWitnessConfigSchema } from './Config.ts'

export type BowserSystemInfoWitnessParams = WitnessParams<AnyConfigSchema<BowserSystemInfoWitnessConfig>>
export class BowserSystemInfoWitness<TParams extends BowserSystemInfoWitnessParams = BowserSystemInfoWitnessParams>
  extends AbstractWitness<TParams>
  implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, BowserSystemInfoWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = BowserSystemInfoWitnessConfigSchema

  protected get bowser() {
    // we do this to fix importing in node-esm

    return Bowser.parse(window.navigator.userAgent)
  }

  protected override observeHandler(payloads?: Payload[]) {
    return [merge({ bowser: this.bowser }, payloads?.[0], { schema: BowserSystemInfoSchema })]
  }
}
