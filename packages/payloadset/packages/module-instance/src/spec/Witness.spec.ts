import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'

import { AbstractModuleInstanceWitness, AbstractModuleInstanceWitnessConfigSchema } from '../Witness.js'

describe('AbstractModuleInstanceWitness', () => {
  test('Witnessing', async () => {
    const mod = await MemoryArchivist.create({ account: 'random' })
    const witness = await AbstractModuleInstanceWitness.create({
      account: 'random',
      config: { schema: AbstractModuleInstanceWitnessConfigSchema },
      mod,
    })
    const [result] = await witness.observe()
    expect(await PayloadWrapper.wrap(result).getValid()).toBe(true)
  })

  test('Witnessing [no config]', async () => {
    const witness = await AbstractModuleInstanceWitness.create()
    const [result] = await witness.observe()
    expect(await PayloadWrapper.wrap(result).getValid()).toBe(true)
  })
})
