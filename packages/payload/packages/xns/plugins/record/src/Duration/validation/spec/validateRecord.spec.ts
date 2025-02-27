import '@xylabs/vitest-extended'

import { Payload } from '@xyo-network/payload-model'
import {
  describe, expect, it,
} from 'vitest'

import { DurationFields } from '../../Duration.ts'
import { validateDuration } from '../validateDuration.ts'

describe('validateRecord', () => {
  const schema = 'network.xyo.test'
  const recordPayload = {
    domain: 'foo.xyo',
    exp: Date.now() + 1_000_000,
    nameserver: ['e007fb034344d8e559b224156fe08627e5c8ea1c'],
    nbf: Date.now(),
    schema,
  }
  describe('returns true', () => {
    it('with valid record', () => {
      expect(validateDuration(recordPayload)).toBeTrue()
    })
  })
  describe('returns false', () => {
    describe('with invalid time range', () => {
      it('when current time is before nbf', () => {
        const payload: Payload<DurationFields> = { ...recordPayload, nbf: Date.now() + 10_000 }
        expect(validateDuration(payload)).toBeFalse()
      })
      it('when current time is after exp', () => {
        const payload: Payload<DurationFields> = { ...recordPayload, exp: Date.now() - 1 }
        expect(validateDuration(payload)).toBeFalse()
      })
    })
  })
})
