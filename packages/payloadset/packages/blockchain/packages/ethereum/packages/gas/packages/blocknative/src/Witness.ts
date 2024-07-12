import { AbstractWitness } from '@xyo-network/abstract-witness'
import { EthereumGasBlocknativePayload, EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, Schema } from '@xyo-network/payload-model'
import { TimestampWitnessParams } from '@xyo-network/witness-timestamp'

import { EthereumGasBlocknativeWitnessConfig } from './Config.js'
import { getGasFromBlocknative } from './lib/index.js'
import { EthereumGasBlocknativeWitnessConfigSchema } from './Schema.js'

export type EthereumGasBlocknativeWitnessParams = TimestampWitnessParams<AnyConfigSchema<EthereumGasBlocknativeWitnessConfig>>
export class EthereumGasBlocknativeWitness extends AbstractWitness<EthereumGasBlocknativeWitnessParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasBlocknativeWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasBlocknativeWitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const fields = await getGasFromBlocknative()
    const payload = await new PayloadBuilder<EthereumGasBlocknativePayload>({
      schema: EthereumGasBlocknativeSchema,
    })
      .fields(fields)
      .build()
    return [payload]
  }
}
