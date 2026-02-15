import { assertEx } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { EthereumGasEtherscanPayload } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import { EthereumGasEtherscanSchema } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import { PayloadBuilder } from '@xyo-network/sdk-js'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { EthereumGasEtherscanWitnessConfig } from './Config.ts'
import { getGasFromEtherscan } from './lib/index.ts'
import { EthereumGasEtherscanWitnessConfigSchema } from './Schema.ts'

export class EthereumGasEtherscanWitness extends AbstractWitness<WitnessParams<AnyConfigSchema<EthereumGasEtherscanWitnessConfig>>> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasEtherscanWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasEtherscanWitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const apiKey = assertEx(this.config?.apiKey, () => 'apiKey is required')
    const payload = new PayloadBuilder<EthereumGasEtherscanPayload>({ schema: EthereumGasEtherscanSchema })
      .fields(await getGasFromEtherscan(apiKey))
      .build()
    return [payload]
  }
}
