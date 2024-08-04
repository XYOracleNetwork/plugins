import { AbstractWitness } from '@xyo-network/abstract-witness'
import { EthereumGasEtherchainV2Payload, EthereumGasEtherchainV2Schema } from '@xyo-network/etherchain-ethereum-gas-v2-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload, Schema } from '@xyo-network/payload-model'
import { WitnessParams } from '@xyo-network/witness-model'

import { EthereumGasEtherchainV2WitnessConfig } from './Config.ts'
import { getV2GasFromEtherchain } from './lib/index.ts'
import { EthereumGasEtherchainV2WitnessConfigSchema } from './Schema.ts'

export type EtherchainEthereumGasWitnessV2Params = WitnessParams<AnyConfigSchema<EthereumGasEtherchainV2WitnessConfig>>

export class EtherchainEthereumGasWitnessV2 extends AbstractWitness<EtherchainEthereumGasWitnessV2Params> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasEtherchainV2WitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasEtherchainV2WitnessConfigSchema

  protected override async observeHandler(): Promise<Payload[]> {
    const payload: EthereumGasEtherchainV2Payload = {
      ...(await getV2GasFromEtherchain()),
      schema: EthereumGasEtherchainV2Schema,
      timestamp: Date.now(),
    }
    return [payload]
  }
}
