import '@xylabs/vitest-extended'

import {
  describe,
  it,
} from 'vitest'

import { scoreName } from '../name.ts'
import { expectMaxPossibleScore, expectMiniumScore } from './testHelpers.ts'

const valid = ['Foo Friends #3042', '🔥 Fire & Such']
const invalid = [{}]
const missing = ['', undefined, null]

describe('scoreName', () => {
  describe('with valid name', () => {
    it.each(valid)('returns max possible score', (value) => {
      const score = scoreName(value)
      expectMaxPossibleScore(score)
    })
  })
  describe('with missing or invalid name', () => {
    it.each([...missing, ...invalid])('returns minimum score', (value) => {
      const score = scoreName(value)
      expectMiniumScore(score)
    })
  })
})
