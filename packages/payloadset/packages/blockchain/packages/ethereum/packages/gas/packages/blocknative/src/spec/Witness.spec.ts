import '@xylabs/vitest-extended'

import { EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  describe, expect,
  it,
} from 'vitest'

import { EthereumGasBlocknativeWitnessConfigSchema } from '../Schema.ts'
import { EthereumGasBlocknativeWitness } from '../Witness.ts'

describe('EthereumGasBlocknativeWitness', () => {
  it('returns observation', async () => {
    const sut = await EthereumGasBlocknativeWitness.create({
      account: 'random',
      config: { schema: EthereumGasBlocknativeWitnessConfigSchema },
    })
    const [actual] = await sut.observe()
    expect(actual.schema).toBe(EthereumGasBlocknativeSchema)
    const answerWrapper = PayloadWrapper.wrap(actual)
    expect(await answerWrapper.getValid()).toBe(true)
  })
})
