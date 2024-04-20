import { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { WitnessModule, WitnessParams } from '@xyo-network/witness-model'

import { FileWitnessConfig, FileWitnessConfigSchema } from './Config'
import { FileSchema } from './Schema'

export type FileWitnessParams = WitnessParams<AnyConfigSchema<FileWitnessConfig>>

// Abstract so that derived classes provide a type for the file param and methods to parse it
export abstract class FileWitness<TParams extends FileWitnessParams = FileWitnessParams> extends AbstractWitness<TParams> implements WitnessModule {
  static override configSchemas: Schema[] = [...super.configSchemas, FileWitnessConfigSchema]
  static override defaultConfigSchema: Schema = FileWitnessConfigSchema

  protected override observeHandler(payloads?: Payload[]): Promisable<Payload[]> {
    return [{ ...payloads?.[0], schema: FileSchema }]
  }
}
