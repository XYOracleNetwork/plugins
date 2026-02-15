import { assertEx } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { EthereumGasEthersPayload } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { EthereumGasEthersSchema } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { Provider } from 'ethers'

import type { EthereumGasEthersWitnessConfig } from './Config.ts'
import { getGasFromEthers } from './lib/index.ts'
import { EthereumGasEthersWitnessConfigSchema } from './Schema.ts'

export interface EthereumGasEthersWitnessParams extends WitnessParams<
  AnyConfigSchema<EthereumGasEthersWitnessConfig>>
{
  provider?: Provider
}

export class EthereumGasEthersWitness<
  TParams extends EthereumGasEthersWitnessParams = EthereumGasEthersWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasEthersWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasEthersWitnessConfigSchema

  private _provider?: Provider

  protected get provider() {
    this._provider = this._provider ?? this.params?.provider
    return this._provider
  }

  protected override async observeHandler(): Promise<Payload[]> {
    const payload = new PayloadBuilder<EthereumGasEthersPayload>({ schema: EthereumGasEthersSchema })
      .fields(await getGasFromEthers(assertEx(this.provider, () => 'Provider Required')))
      .build()
    return [payload]
  }
}
