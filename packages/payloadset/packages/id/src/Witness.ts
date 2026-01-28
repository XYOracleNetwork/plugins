import type { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { Id } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import {
  asSchema, type Payload, type Schema,
} from '@xyo-network/payload-model'
import type { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'

export type IdWitnessConfigSchema = typeof IdWitnessConfigSchema
export const IdWitnessConfigSchema = asSchema('network.xyo.id.witness.config', true)

export type IdWitnessConfig = WitnessConfig<{
  salt?: string
  schema: IdWitnessConfigSchema
}>

export type IdWitnessParams = WitnessParams<AnyConfigSchema<IdWitnessConfig>>

export class IdWitness<TParams extends IdWitnessParams = IdWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, IdWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = IdWitnessConfigSchema

  get salt() {
    return this.config?.salt ?? `${Math.floor(Math.random() * 9_999_999)}`
  }

  protected override observeHandler(payloads: Payload[] = []): Promisable<Id[]> {
    return payloads.length > 0
      ? (payloads as Id[]).map((fieldItems) => {
          return {
            salt: fieldItems?.salt ?? this.salt,
            schema: IdSchema,
          }
        })
      : [
          {
            salt: this.salt,
            schema: IdSchema,
          },
        ]
  }
}
