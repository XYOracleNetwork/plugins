import { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import {
  WitnessConfig, WitnessModule, WitnessParams,
} from '@xyo-network/witness-model'

import { CryptoCardsGameWitnessConfigSchema } from './Schema.ts'

export type CryptoCardsGameWitnessConfig = WitnessConfig<{
  schema: CryptoCardsGameWitnessConfigSchema
}>

export type CryptoCardsGameWitnessParams = WitnessParams<AnyConfigSchema<CryptoCardsGameWitnessConfig>>

export class CryptoCardsGameWitness extends AbstractWitness<CryptoCardsGameWitnessParams> implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CryptoCardsGameWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = CryptoCardsGameWitnessConfigSchema

  protected override observeHandler(payloads?: Payload[]): Promisable<Payload[]> {
    return payloads ?? []
  }
}
