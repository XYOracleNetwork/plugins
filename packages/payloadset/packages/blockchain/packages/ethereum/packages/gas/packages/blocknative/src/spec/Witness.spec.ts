import { Account } from '@xyo-network/account'
import { EthereumGasBlocknativeSchema } from '@xyo-network/blocknative-ethereum-gas-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { EthereumGasBlocknativeWitnessConfigSchema } from '../Schema'
import { EthereumGasBlocknativeWitness } from '../Witness'

describe('EthereumGasBlocknativeWitness', () => {
  it('returns observation', async () => {
    const sut = await EthereumGasBlocknativeWitness.create({
      account: Account.randomSync(),
      config: {
        schema: EthereumGasBlocknativeWitnessConfigSchema,
      },
    })
    const [actual] = await sut.observe()
    expect(actual.schema).toBe(EthereumGasBlocknativeSchema)
    const answerWrapper = await PayloadWrapper.wrap(actual)
    expect(await answerWrapper.getValid()).toBe(true)
  })
})
