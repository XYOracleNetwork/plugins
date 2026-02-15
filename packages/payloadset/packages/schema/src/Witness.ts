import { delay } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import {
  asSchema, type Payload, type Schema,
} from '@xyo-network/payload-model'
import type { SchemaPayload } from '@xyo-network/schema-payload-plugin'
import type {
  WitnessConfig, WitnessModule, WitnessParams,
} from '@xyo-network/witness-model'

export type SchemaWitnessConfigSchema = typeof SchemaWitnessConfigSchema
export const SchemaWitnessConfigSchema = asSchema('network.xyo.schema.witness.config', true)

export type SchemaWitnessConfig = WitnessConfig<{ schema: SchemaWitnessConfigSchema }>

export type SchemaWitnessParams = WitnessParams<AnyConfigSchema<SchemaWitnessConfig>>

export class SchemaWitness<TParams extends SchemaWitnessParams = SchemaWitnessParams> extends AbstractWitness<TParams> implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, SchemaWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = SchemaWitnessConfigSchema

  protected override async observeHandler(_payloads?: Payload[]): Promise<SchemaPayload[]> {
    await delay(0)
    throw new Error('Method not implemented.')
  }
}
