import '@xylabs/vitest-extended'

import {
  describe,
  it,
} from 'vitest'

import { scoreBackgroundColor } from '../backgroundColor.ts'
import {
  expectLoweredScore, expectMaxPossibleScore, expectNoScore,
} from './testHelpers.ts'

const valid = ['ffffff', 'FFFFFF']
const invalid = ['#ffffff', '#FFFFFF', '', 'not a color', {}]
const missing = [undefined, null]

describe('scoreBackgroundColor', () => {
  describe('with valid background_color', () => {
    it.each(valid)('returns max possible score', (value) => {
      const score = scoreBackgroundColor(value)
      expectMaxPossibleScore(score)
    })
  })
  describe('with invalid background_color', () => {
    it.each(invalid)('returns lowered score', (value) => {
      const score = scoreBackgroundColor(value)
      expectLoweredScore(score)
    })
  })
  describe('with missing background_color', () => {
    it.each(missing)('returns no score', (value) => {
      const score = scoreBackgroundColor(value)
      expectNoScore(score)
    })
  })
})
