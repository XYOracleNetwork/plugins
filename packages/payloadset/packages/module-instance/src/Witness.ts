import type { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AbstractModuleInstancePayload } from '@xyo-network/module-instance-payload-plugin'
import type { AnyConfigSchema, Module } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'

export type AbstractModuleInstanceWitnessConfigSchema = 'network.xyo.module.instance.config'
export const AbstractModuleInstanceWitnessConfigSchema: AbstractModuleInstanceWitnessConfigSchema = 'network.xyo.module.instance.config'

export type AbstractModuleInstanceWitnessConfig = WitnessConfig<{
  schema: AbstractModuleInstanceWitnessConfigSchema
}>

export interface AbstractModuleInstanceWitnessParams extends WitnessParams<
  AnyConfigSchema<AbstractModuleInstanceWitnessConfig>>
{
  mod?: Module
}

export class AbstractModuleInstanceWitness<
  TParams extends AbstractModuleInstanceWitnessParams = AbstractModuleInstanceWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, AbstractModuleInstanceWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = AbstractModuleInstanceWitnessConfigSchema

  protected get mod() {
    return this.params?.mod
  }

  protected override observeHandler(_payloads?: Partial<Payload>[]): Promisable<AbstractModuleInstancePayload[]> {
    // This was broken anyway (previous use of merge made it compile, but would not have worked)
    return [] // [{ queries: this.mod?.queries ?? [], ...payloads?.[0], schema: AbstractModuleInstanceSchema }]
  }
}
