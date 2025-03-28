import '@xylabs/vitest-extended'

import type { BinomialDistributionParameters } from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  describe, expect,
  it,
} from 'vitest'

import { calculateBinomialParamsFromProbability } from '../calculateBinomialParamsFromProbability.ts'

describe('calculateBinomialParamsFromProbability', () => {
  const data: [values: [trials: number, probability: number], outcome: BinomialDistributionParameters][] = [
    [[2, 0.5], {
      mean: 1, p: 0.5, stdDev: 0.707_106_781_186_547_6, variance: 0.5,
    }],
    [[4, 0.5], {
      mean: 2, p: 0.5, stdDev: 1, variance: 1,
    }],
    [[4, 0.25], {
      mean: 1, p: 0.25, stdDev: 0.866_025_403_784_438_6, variance: 0.75,
    }],
    [[4, 1], {
      mean: 4, p: 1, stdDev: 0, variance: 0,
    }],
    [[4, 0], {
      mean: 0, p: 0, stdDev: 0, variance: 0,
    }],
  ]
  it.each(data)('calculates the params', (values, outcome) => {
    const result = calculateBinomialParamsFromProbability(values[0], values[1])
    expect(result).toEqual(outcome)
  })
})
