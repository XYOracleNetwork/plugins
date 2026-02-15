import type { Promisable } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'

import { CryptoCardsMoveWitnessConfigSchema } from './Schema.ts'

export type CryptoCardsMoveWitnessConfig = WitnessConfig<{
  schema: CryptoCardsMoveWitnessConfigSchema
}>

export type CryptoCardsMoveWitnessParams = WitnessParams<AnyConfigSchema<CryptoCardsMoveWitnessConfig>>

export class CryptoCardsMoveWitness<TParams extends CryptoCardsMoveWitnessParams = CryptoCardsMoveWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoCardsMoveWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoCardsMoveWitnessConfigSchema

  protected override observeHandler(payloads?: Payload[]): Promisable<Payload[]> {
    return payloads ?? []
  }
}
