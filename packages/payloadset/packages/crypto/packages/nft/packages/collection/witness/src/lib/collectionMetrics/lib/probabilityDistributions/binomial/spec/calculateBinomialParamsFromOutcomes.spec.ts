import '@xylabs/vitest-extended'

import { BinomialDistributionParameters } from '@xyo-network/crypto-nft-collection-payload-plugin'
import {
  describe, expect,
  it,
} from 'vitest'

import { calculateBinomialParamsFromOutcomes } from '../calculateBinomialParamsFromOutcomes.ts'

describe('calculateBinomialParamsFromOutcomes', () => {
  const data: [values: number[], outcome: BinomialDistributionParameters][] = [
    [[1, 0], {
      mean: 1, p: 0.5, stdDev: 0.707_106_781_186_547_6, variance: 0.5,
    }],
    [[1, 1, 0, 0], {
      mean: 2, p: 0.5, stdDev: 1, variance: 1,
    }],
    [[1, 0, 0, 0], {
      mean: 1, p: 0.25, stdDev: 0.866_025_403_784_438_6, variance: 0.75,
    }],
    [[1, 1, 1, 1], {
      mean: 4, p: 1, stdDev: 0, variance: 0,
    }],
    [[0, 0, 0, 0], {
      mean: 0, p: 0, stdDev: 0, variance: 0,
    }],
  ]
  it.each(data)('calculates the params', (values, outcome) => {
    const result = calculateBinomialParamsFromOutcomes(values)
    expect(result).toEqual(outcome)
  })
})
