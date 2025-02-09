import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { sampleEtherchainGasV2 } from '../../../test/index.ts'
import { transformGasFromEtherchainV2 } from '../transformGasFromEtherchainV2.ts'

describe('transformGasFromEtherchainV2', () => {
  it('returns values in the expected format', () => {
    const result = transformGasFromEtherchainV2(sampleEtherchainGasV2)
    expect(result).toBeObject()
    expect(result.baseFee).toBeUndefined()
    expect(result.feePerGas).toBeObject()
    expect(result.feePerGas.low).toBeNumber()
    expect(result.feePerGas.medium).toBeNumber()
    expect(result.feePerGas.high).toBeNumber()
    expect(result.feePerGas.veryHigh).toBeNumber()
    expect(result.priorityFeePerGas).toBeObject()
    expect(result.priorityFeePerGas.low).toBeUndefined()
    expect(result.priorityFeePerGas.medium).toBeUndefined()
    expect(result.priorityFeePerGas.high).toBeUndefined()
    expect(result.priorityFeePerGas.veryHigh).toBeUndefined()
  })
  it('matches expected output', () => {
    const result = transformGasFromEtherchainV2(sampleEtherchainGasV2)
    expect(result).toMatchObject({
      baseFee: undefined,
      feePerGas: {
        low: 11.2,
        medium: 12,
        high: 19.803_047_33,
        veryHigh: 29.714_286_17,
      },
      priorityFeePerGas: {},
    })
  })
})
