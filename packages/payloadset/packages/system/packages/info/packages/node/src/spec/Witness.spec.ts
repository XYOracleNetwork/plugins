import '@xylabs/vitest-extended'

import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  describe, expect,
  test,
} from 'vitest'

import { NodeSystemInfoWitnessConfigSchema } from '../Config.ts'
import { NodeSystemInfoWitness } from '../Witness.ts'

describe('SystemInfoWitness', () => {
  test('observe', async () => {
    const witness = await NodeSystemInfoWitness.create({
      account: 'random',
      config: { schema: NodeSystemInfoWitnessConfigSchema },
    })

    const [observation] = await witness.observe()
    expect(observation.schema).toBe('network.xyo.system.info.node')
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  }, 60_000)
  test('observe [no config]', async () => {
    const witness = await NodeSystemInfoWitness.create({ account: 'random' })

    const [observation] = await witness.observe()
    expect(observation.schema).toBe('network.xyo.system.info.node')
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  }, 60_000)
})
