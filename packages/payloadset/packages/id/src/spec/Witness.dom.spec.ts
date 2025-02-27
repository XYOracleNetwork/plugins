import '@xylabs/vitest-extended'

import { IdSchema } from '@xyo-network/id-payload-plugin'
import { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import {
  describe, expect,
  test,
} from 'vitest'

import { IdWitness, IdWitnessConfigSchema } from '../Witness.ts'

describe('IdWitness [Browser]', () => {
  test('observe', async () => {
    const witness = await IdWitness.create({
      account: 'random',
      config: { salt: 'test', schema: IdWitnessConfigSchema },
    })
    const [observation] = await witness.observe([{ salt: 'test', schema: IdSchema } as Payload])
    expect(observation.schema).toBe(IdSchema)
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })

  test('observe [no salt]', async () => {
    const witness = await IdWitness.create({
      account: 'random',
      config: { schema: IdWitnessConfigSchema },
    })
    const [observation] = await witness.observe([{ salt: 'test', schema: IdSchema } as Payload])
    expect(observation.schema).toBe(IdSchema)
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })
})
