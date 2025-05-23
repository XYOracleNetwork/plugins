import '@xylabs/vitest-extended'

import {
  AddressTransactionHistoryWitnessConfigSchema,
  isAddressTransactionHistoryPayload,
} from '@xyo-network/crypto-address-transaction-history-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { EtherscanProvider } from 'ethers'
import {
  describe, expect,
  test,
} from 'vitest'

import { AddressTransactionHistoryWitness } from '../Witness.ts'

describe.skipIf(!process.env.ETHERSCAN_API_KEY)('AddressTransactionHistoryWitness', () => {
  const address = '0x35C556C8e97509Bf1f6D286BB0137512E11711a6'
  const network = 'homestead'
  const apiKey = process.env.ETHERSCAN_API_KEY
  const provider = new EtherscanProvider(network, apiKey)
  test('observe', async () => {
    const witness = await AddressTransactionHistoryWitness.create({
      config: { address, schema: AddressTransactionHistoryWitnessConfigSchema },
      provider,
    })
    const observation = await witness.observe()
    const transactions = observation.filter(isAddressTransactionHistoryPayload)
    expect(transactions.length).toBeGreaterThan(0)
    expect(observation.length).toEqual(transactions.length)
    for (const transaction of transactions) {
      const wrapped = PayloadWrapper.wrap(transaction)
      expect(await wrapped.getValid()).toBe(true)
    }
  })
})
