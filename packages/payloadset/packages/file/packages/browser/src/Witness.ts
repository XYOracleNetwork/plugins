import type { Promisable } from '@xylabs/promise'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessModule, WitnessParams } from '@xyo-network/witness-model'

import type { FileWitnessConfig } from './Config.ts'
import { FileWitnessConfigSchema } from './Config.ts'
import { FileSchema } from './Schema.ts'

export type FileWitnessParams = WitnessParams<AnyConfigSchema<FileWitnessConfig>>

// Abstract so that derived classes provide a type for the file param and methods to parse it
export abstract class FileWitness<TParams extends FileWitnessParams = FileWitnessParams> extends AbstractWitness<TParams> implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, FileWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = FileWitnessConfigSchema

  protected override observeHandler(payloads?: Payload[]): Promisable<Payload[]> {
    return [{ ...payloads?.[0], schema: FileSchema }]
  }
}
