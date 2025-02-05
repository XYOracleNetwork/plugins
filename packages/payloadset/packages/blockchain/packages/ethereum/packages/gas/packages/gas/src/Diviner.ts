import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import type {
  DivinerConfig, DivinerModule, DivinerParams,
} from '@xyo-network/diviner-model'
import { EthereumGasSchema } from '@xyo-network/gas-price-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'

import { divineGas } from './lib/index.ts'
import { EthereumGasDivinerConfigSchema } from './Schema.ts'

export type EthereumGasDivinerConfig = DivinerConfig<{ schema: EthereumGasDivinerConfigSchema }>
export type EthereumGasDivinerParams = DivinerParams<AnyConfigSchema<EthereumGasDivinerConfig>>

export class EthereumGasDiviner<TParams extends EthereumGasDivinerParams = EthereumGasDivinerParams>
  extends AbstractDiviner<TParams>
  implements DivinerModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, EthereumGasDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = EthereumGasDivinerConfigSchema
  static override readonly targetSchema: string = EthereumGasSchema

  protected override divineHandler(payloads?: Payload[]): Payload[] {
    const cost = divineGas(payloads ?? [])
    return [cost]
  }
}
