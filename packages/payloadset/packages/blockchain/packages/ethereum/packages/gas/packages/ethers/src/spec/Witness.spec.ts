import type { EthereumGasEthersPayload } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { EthereumGasEthersSchema } from '@xyo-network/ethers-ethereum-gas-payload-plugin'
import { PayloadWrapper } from '@xyo-network/sdk-js'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'

import { EthereumGasEthersWitnessConfigSchema } from '../Schema.ts'
import { EthereumGasEthersWitness } from '../Witness.ts'

const projectId = process.env.INFURA_PROJECT_ID || ''
const projectSecret = process.env.INFURA_PROJECT_SECRET || ''

import '@xylabs/vitest-extended'

import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import {
  describe, expect,
  test,
} from 'vitest'

/**
 * @group crypto
 * @group slow
 */

describe('EthereumGasEthersWitness', () => {
  test.skipIf(!projectId || !projectSecret)('returns observation', async () => {
    const provider = getProviderFromEnv()
    const sut = await EthereumGasEthersWitness.create({
      account: 'random',
      config: { schema: EthereumGasEthersWitnessConfigSchema },
      provider,
    })
    const observed = await sut.observe()
    const actual = observed.find(isPayloadOfSchemaType<EthereumGasEthersPayload>(EthereumGasEthersSchema))
    expect((actual as EthereumGasEthersPayload).gasPrice).toBeNumber()
    expect(actual?.schema).toBe(EthereumGasEthersSchema)
    const answerWrapper = PayloadWrapper.wrap(actual)
    expect(await answerWrapper.getValid()).toBe(true)
  })
})
