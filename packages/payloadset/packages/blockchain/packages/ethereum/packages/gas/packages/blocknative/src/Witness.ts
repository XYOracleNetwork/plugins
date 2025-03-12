import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { EthereumGasBlocknativePayload } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { TimestampWitnessParams } from '@xyo-network/witness-timestamp'

import type { EthereumGasBlocknativeWitnessConfig } from './Config.ts'
import { getGasFromBlocknative } from './lib/index.ts'
import { EthereumGasBlocknativeWitnessConfigSchema } from './Schema.ts'

export type EthereumGasBlocknativeWitnessParams = TimestampWitnessParams<AnyConfigSchema<EthereumGasBlocknativeWitnessConfig>>
export class EthereumGasBlocknativeWitness extends AbstractWitness<EthereumGasBlocknativeWitnessParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasBlocknativeWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasBlocknativeWitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const fields = await getGasFromBlocknative()
    const payload = new PayloadBuilder<EthereumGasBlocknativePayload>({ schema: EthereumGasBlocknativeSchema })
      .fields(fields)
      .build()
    return [payload]
  }
}
