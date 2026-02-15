import '@xylabs/vitest-extended'

import { PayloadWrapper } from '@xyo-network/sdk-js'
import {
  describe, expect,
  it,
} from 'vitest'

import { PrometheusNodeWitness } from '../Witness.ts'

describe('PrometheusNodeWitness', () => {
  it('Witnessing [no config]', async () => {
    const witness = await PrometheusNodeWitness.create({ account: 'random' })
    const observation = await witness.observe()
    expect(observation?.length).toBeGreaterThan(0)
    expect(await PayloadWrapper.wrap(observation[0]).getValid()).toBe(true)
    await witness.stop()
  })
})
