import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AddressTransactionHistoryPayload } from '@xyo-network/crypto-address-transaction-history-payload-plugin'
import {
  AddressTransactionHistorySchema,
  AddressTransactionHistoryWitnessConfigSchema,
} from '@xyo-network/crypto-address-transaction-history-payload-plugin'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { WitnessParams } from '@xyo-network/witness-model'
import type { EtherscanProvider } from 'ethers'

import type { AddressTransactionHistoryWitnessConfig } from './Config.ts'
import { getTransactionsForAddress } from './lib/index.ts'

export type AddressTransactionHistoryWitnessParams = WitnessParams<
  AnyConfigSchema<AddressTransactionHistoryWitnessConfig>,
  {
    provider?: EtherscanProvider
  }
>

const schema = AddressTransactionHistorySchema

export class AddressTransactionHistoryWitness<
  TParams extends AddressTransactionHistoryWitnessParams = AddressTransactionHistoryWitnessParams,
> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, AddressTransactionHistoryWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = AddressTransactionHistoryWitnessConfigSchema

  protected get provider() {
    return assertEx(this.params.provider, () => 'Provider Required')
  }

  protected override async observeHandler(): Promise<Payload[]> {
    await this.started('throw')
    const address = assertEx(this.config.address, () => 'params.address is required')
    const transactions = await getTransactionsForAddress(address, this.provider)
    const payloads = transactions.map<AddressTransactionHistoryPayload>((transaction) => {
      return { ...transaction, schema }
    })
    return payloads
  }
}
