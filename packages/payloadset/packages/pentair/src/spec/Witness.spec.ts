import '@xylabs/vitest-extended'

import { PayloadWrapper } from '@xyo-network/sdk-js'
import {
  describe, expect,
  test,
} from 'vitest'

import { PentairScreenlogicWitness } from '../Witness.ts'

describe('PentairScreenLogicWitness', () => {
  test.skipIf(process.env.TEST_PENTAIR !== 'true')('Witnessing [no config]', async () => {
    const witness = await PentairScreenlogicWitness.create({ account: 'random' })
    const [observation] = await witness.observe()
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })
})
