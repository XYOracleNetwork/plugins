import { merge } from '@xylabs/lodash'
import { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AbstractModuleInstanceSchema } from '@xyo-network/module-instance-payload-plugin'
import { AnyConfigSchema, Module } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'

export type AbstractModuleInstanceWitnessConfigSchema = 'network.xyo.module.instance.config'
export const AbstractModuleInstanceWitnessConfigSchema: AbstractModuleInstanceWitnessConfigSchema = 'network.xyo.module.instance.config'

export type AbstractModuleInstanceWitnessConfig = WitnessConfig<{
  schema: AbstractModuleInstanceWitnessConfigSchema
}>

export type AbstractModuleInstanceWitnessParams = WitnessParams<
  AnyConfigSchema<AbstractModuleInstanceWitnessConfig>,
  {
    mod?: Module
  }
>

export class AbstractModuleInstanceWitness<
  TParams extends AbstractModuleInstanceWitnessParams = AbstractModuleInstanceWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, AbstractModuleInstanceWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = AbstractModuleInstanceWitnessConfigSchema

  protected get mod() {
    return this.params?.mod
  }

  protected override observeHandler(payloads?: Partial<Payload>[]): Promisable<Payload[]> {
    return [merge({ queries: this.mod?.queries ?? [] }, payloads?.[0], { schema: AbstractModuleInstanceSchema })]
  }
}
