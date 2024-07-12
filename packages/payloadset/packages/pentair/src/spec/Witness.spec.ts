import { testIf } from '@xylabs/jest-helpers'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { PentairScreenlogicWitness } from '../Witness.js'

describe('PentairScreenLogicWitness', () => {
  testIf(process.env.TEST_PENTAIR === 'true')('Witnessing [no config]', async () => {
    const witness = await PentairScreenlogicWitness.create({ account: 'random' })
    const [observation] = await witness.observe()
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })
})
