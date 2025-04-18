import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { sampleBlocknativeGas } from '../../../test/index.ts'
import { transformGasFromBlocknative } from '../transformGasFromBlocknative.ts'

describe('transformGasFromEtherscan', () => {
  it('returns values in the expected format', () => {
    const result = transformGasFromBlocknative(sampleBlocknativeGas)
    expect(result).toBeObject()
    expect(result.baseFee).toBeNumber()
    expect(result.feePerGas).toBeObject()
    expect(result.feePerGas.low).toBeNumber()
    expect(result.feePerGas.medium).toBeNumber()
    expect(result.feePerGas.high).toBeNumber()
    expect(result.feePerGas.veryHigh).toBeNumber()
    expect(result.priorityFeePerGas).toBeObject()
    expect(result.priorityFeePerGas.low).toBeNumber()
    expect(result.priorityFeePerGas.medium).toBeNumber()
    expect(result.priorityFeePerGas.high).toBeNumber()
    expect(result.priorityFeePerGas.veryHigh).toBeNumber()
  })
  it('matches expected output', () => {
    const result = transformGasFromBlocknative(sampleBlocknativeGas)
    expect(result).toMatchObject({
      baseFee: 13.691_764_456,
      feePerGas: {
        low: 12.95,
        medium: 13.25,
        high: 13.55,
        veryHigh: 13.85,
      },
      priorityFeePerGas: {
        low: 0.14,
        medium: 0.37,
        high: 0.6,
        veryHigh: 0.83,
      },
    })
  })
})
