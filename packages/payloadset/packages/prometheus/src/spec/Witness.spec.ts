import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { PrometheusNodeWitness } from '../Witness.ts'

describe('PrometheusNodeWitness', () => {
  it('Witnessing [no config]', async () => {
    const witness = await PrometheusNodeWitness.create({
      account: 'random',
    })
    const observation = await witness.observe()
    expect(observation?.length).toBeGreaterThan(0)
    expect(await PayloadWrapper.wrap(observation[0]).getValid()).toBe(true)
    await witness.stop()
  })
})
