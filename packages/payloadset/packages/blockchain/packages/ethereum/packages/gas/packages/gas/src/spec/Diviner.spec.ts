import { EthereumGasBlocknativeWitness, EthereumGasBlocknativeWitnessConfigSchema } from '@xyo-network/blocknative-ethereum-gas-plugin'
import { EtherchainEthereumGasWitnessV2, EthereumGasEtherchainV2WitnessConfigSchema } from '@xyo-network/etherchain-gas-ethereum-blockchain-plugins'
import { EthereumGasEthersWitness, EthereumGasEthersWitnessConfigSchema } from '@xyo-network/ethers-ethereum-gas-plugin'
import { EthereumGasEtherscanWitness, EthereumGasEtherscanWitnessConfigSchema } from '@xyo-network/etherscan-ethereum-gas-plugin'
import { EthereumGasPayload, EthereumGasSchema } from '@xyo-network/gas-price-payload-plugin'
import { Payload, WithMeta } from '@xyo-network/payload-model'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'

import { EthereumGasDiviner } from '../Diviner.ts'
import { sampleBlocknativeGas, sampleEtherchainGasV2, sampleEtherscanGas, sampleEthersGas, sampleEthgasstationGas } from '../test'

describe('Diviner', () => {
  const cases: [title: string, data: Payload[]][] = [
    ['EthereumGasBlocknativePayload', [sampleBlocknativeGas]],
    ['EthereumGasEtherchainV2Payload', [sampleEtherchainGasV2]],
    ['EthereumGasEtherscanPayload', [sampleEtherscanGas]],
    ['EthereumGasEthersPayload', [sampleEthersGas]],
    ['EthereumGasEthgasstationPayload', [sampleEthgasstationGas]],
    ['no gas payloads', []],
    ['all supported gas payloads', [sampleBlocknativeGas, sampleEtherchainGasV2, sampleEtherscanGas, sampleEthersGas, sampleEthgasstationGas]],
  ]
  test.each(cases)('with %s returns divined gas price', async (_title: string, data: Payload[]) => {
    const diviner = await EthereumGasDiviner.create({ account: 'random' })
    const payloads = await diviner.divine(data)
    expect(payloads).toBeArray()
    expect(payloads.length).toBe(1)
    const gasPayload = payloads.pop() as WithMeta<EthereumGasPayload>
    expect(gasPayload).toBeObject()
    expect(gasPayload.schema).toBe(EthereumGasSchema)
    expect(gasPayload.timestamp).toBeNumber()
    expect(gasPayload.feePerGas).toBeObject()
    expect(gasPayload.priorityFeePerGas).toBeObject()
  })
  test.skip('diviner calibration', async () => {
    const provider = getProviderFromEnv()
    // NOTE: This test is for obtaining concurrent witnessed
    // results for diviner weighting/calibration
    const blocknativeGas = (
      await (
        await EthereumGasBlocknativeWitness.create({
          account: 'random',
          config: {
            schema: EthereumGasBlocknativeWitnessConfigSchema,
          },
        })
      ).observe()
    )?.[0]
    const etherchainGasV2 = (
      await (
        await EtherchainEthereumGasWitnessV2.create({
          account: 'random',
          config: {
            schema: EthereumGasEtherchainV2WitnessConfigSchema,
          },
        })
      ).observe()
    )?.[0]
    const etherscanGas = (
      await (
        await EthereumGasEtherscanWitness.create({
          account: 'random',
          config: {
            apiKey: process.env.ETHERSCAN_API_KEY || '',
            schema: EthereumGasEtherscanWitnessConfigSchema,
          },
        })
      ).observe()
    )?.[0]
    const ethersGas = (
      await (
        await EthereumGasEthersWitness.create({
          account: 'random',
          config: {
            schema: EthereumGasEthersWitnessConfigSchema,
          },
          provider,
        })
      ).observe()
    )?.[0]

    const observations: Payload[] = [blocknativeGas, etherchainGasV2, etherscanGas, ethersGas]

    const diviner = await EthereumGasDiviner.create({ account: 'random' })

    const payloads = await diviner.divine(observations)

    expect(payloads).toBeArray()
    expect(payloads.length).toBe(1)
    payloads.map((payload) => {
      if (payload?.schema === EthereumGasSchema) {
        const gasPayload = payload as WithMeta<EthereumGasPayload>
        expect(gasPayload).toBeObject()
        expect(gasPayload.schema).toBe(EthereumGasSchema)
        expect(gasPayload.timestamp).toBeNumber()
      }
    })
  })
})
