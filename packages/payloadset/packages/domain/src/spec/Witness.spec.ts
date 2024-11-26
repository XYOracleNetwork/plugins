import '@xylabs/vitest-extended'

import {
  describe, expect,
  test,
} from 'vitest'

import { DomainWitnessConfigSchema } from '../Config.ts'
import { DomainWitness } from '../Witness.ts'

describe('DomainConfigWitness', () => {
  test('valid-instantiation', async () => {
    const witness = await DomainWitness.create({
      account: 'random',
      config: {
        domain: 'xyo.network',
        schema: DomainWitnessConfigSchema,
      },
    })
    expect(witness).toBeTruthy()
    expect(DomainWitness.dmarc).toBe('_xyo')
  })

  test('generatesDmarc', () => {
    expect(DomainWitness.generateDmarc('foo')).toBe('_xyo.foo')
  })
})
