/**
 * @jest-environment jsdom
 */

import '@xylabs/vitest-extended'

import { BowserSystemInfoSchema } from '@xyo-network/bowser-system-info-payload-plugin'
import { PayloadValidator } from '@xyo-network/payload-validator'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { SchemaNameValidator } from '@xyo-network/schema-name-validator'
import {
  describe, expect,
  test,
} from 'vitest'

import { BowserSystemInfoWitnessConfigSchema } from '../Config.ts'
import { BowserSystemInfoWitness } from '../Witness.ts'

PayloadValidator.setSchemaNameValidatorFactory(schema => new SchemaNameValidator(schema))

/* const cryptoPolyfill = (window: Window & typeof globalThis) => {
  window.crypto = window.crypto ?? { getRandomValues: (arr: []) => Crypto.randomBytes(arr.length) }
}

cryptoPolyfill(window)
*/

describe('BowserSystemInfo', () => {
  test('observe', async () => {
    const witness = await BowserSystemInfoWitness.create({
      account: 'random',
      config: { schema: BowserSystemInfoWitnessConfigSchema },
    })
    const [observation] = await witness.observe()
    expect(observation.schema).toBe(BowserSystemInfoSchema)
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })
  test('observe [no config]', async () => {
    const witness = await BowserSystemInfoWitness.create({ account: 'random' })
    const [observation] = await witness.observe()
    expect(observation.schema).toBe(BowserSystemInfoSchema)
    expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
  })
})
