import '@xylabs/vitest-extended'

import type { Id } from '@xyo-network/id-payload-plugin'
import { IdSchema } from '@xyo-network/id-payload-plugin'
import type { Payload } from '@xyo-network/payload-model'
import { PayloadWrapper } from '@xyo-network/sdk-js'
import {
  describe, expect,
  it,
} from 'vitest'

import { IdWitness, IdWitnessConfigSchema } from '../Witness.ts'

describe('IdWitness', () => {
  describe('observe', () => {
    const payloadSalt = 'payload salt'
    describe('with config', () => {
      const configSalt = 'config salt'
      const config = {
        salt: configSalt,
        schema: IdWitnessConfigSchema,
        targetSchema: IdSchema,
      }
      describe('with payloads supplied to observe', () => {
        it('without salt uses config salt', async () => {
          const witness = await IdWitness.create({ account: 'random', config })
          const observations = (await witness.observe()) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(observation.salt).toBe(witness.config.salt)
        })
        it('with salt uses payload salt', async () => {
          const witness = await IdWitness.create({ account: 'random', config })
          const observations = (await witness.observe([{ salt: payloadSalt, schema: IdSchema }] as Id[])) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(observation.salt).toBe(payloadSalt)
        })
      })
      describe('with no payloads supplied to observe', () => {
        it('uses config salt', async () => {
          const witness = await IdWitness.create({ account: 'random', config })
          const observations = (await witness.observe()) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(observation.salt).toBe(witness.config.salt)
        })
      })
    })
    describe('with no config', () => {
      describe('with payloads supplied to observe', () => {
        it('without salt uses random numeric string', async () => {
          const witness = await IdWitness.create({ account: 'random' })
          const observations = (await witness.observe()) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(Number.parseInt(observation.salt)).toBeInteger()
        })
        it('with salt uses payload salt', async () => {
          const witness = await IdWitness.create({ account: 'random' })
          const observations = (await witness.observe([{ salt: payloadSalt, schema: IdSchema } as Payload])) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(observation.salt).toBe(payloadSalt)
        })
      })
      describe('with no payloads supplied to observe', () => {
        it('uses random numeric string', async () => {
          const witness = await IdWitness.create({ account: 'random' })
          const observations = (await witness.observe()) as Id[]
          await validateObservationShape(observations)
          const [observation] = observations
          expect(Number.parseInt(observation.salt)).toBeInteger()
        })
      })
    })
  })
})

const validateObservationShape = async (observations: Id[]) => {
  expect(observations).toBeArrayOfSize(1)
  const [observation] = observations
  expect(observation.salt).toBeString()
  expect(observation.schema).toBe(IdSchema)
  expect(await PayloadWrapper.wrap(observation).getValid()).toBe(true)
}
