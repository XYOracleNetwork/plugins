import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { EthereumGasEtherscanPayload } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import { EthereumGasEtherscanSchema } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessParams } from '@xyo-network/witness-model'

import type { EthereumGasEtherscanWitnessConfig } from './Config.ts'
import { getGasFromEtherscan } from './lib/index.ts'
import { EthereumGasEtherscanWitnessConfigSchema } from './Schema.ts'

export class EthereumGasEtherscanWitness extends AbstractWitness<WitnessParams<AnyConfigSchema<EthereumGasEtherscanWitnessConfig>>> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasEtherscanWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasEtherscanWitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const apiKey = assertEx(this.config?.apiKey, () => 'apiKey is required')
    const payload = await new PayloadBuilder<EthereumGasEtherscanPayload>({ schema: EthereumGasEtherscanSchema })
      .fields(await getGasFromEtherscan(apiKey))
      .build()
    return [payload]
  }
}
