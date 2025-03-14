import '@xylabs/vitest-extended'

import type { EthereumGasEtherscanPayload } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import { EthereumGasEtherscanSchema } from '@xyo-network/etherscan-ethereum-gas-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasEtherscanWitnessConfigSchema } from '../Schema.ts'
import { EthereumGasEtherscanWitness } from '../Witness.ts'

const apiKey = process.env.ETHERSCAN_API_KEY || ''

describe('EthereumGasEtherscanWitness', () => {
  test.skipIf(!apiKey)('returns observation', async () => {
    const sut = await EthereumGasEtherscanWitness.create({
      config: {
        apiKey,
        schema: EthereumGasEtherscanWitnessConfigSchema,
      },
    })
    const [actual] = (await sut.observe()) as EthereumGasEtherscanPayload[]
    expect(actual.result).toBeObject()
    expect(actual.result.FastGasPrice).toBeString()
    expect(actual.result.gasUsedRatio).toBeString()
    expect(actual.result.LastBlock).toBeString()
    expect(actual.result.ProposeGasPrice).toBeString()
    expect(actual.result.SafeGasPrice).toBeString()
    expect(actual.result.suggestBaseFee).toBeString()

    expect(actual.timestamp).toBeNumber()
    expect(actual.schema).toBe(EthereumGasEtherscanSchema)

    const answerWrapper = PayloadWrapper.wrap(actual)
    expect(await answerWrapper.getValid()).toBe(true)
  })

  /* describe('create', () => {
    it('throws if no params provided', async () => {
      await expect(EthereumGasEtherscanWitness.create()).toReject()
    })
  }) */
})
