import '@xylabs/vitest-extended'

import {
  describe, expect, it,
} from 'vitest'

import { sampleEthersGas } from '../../../test/index.ts'
import { transformGasFromEthers } from '../transformGasFromEthers.ts'

describe('transformGasFromEthers', () => {
  it('returns values in the expected format', () => {
    const result = transformGasFromEthers(sampleEthersGas)
    expect(result).toBeObject()
    expect(result.baseFee).toBeNumber()
    expect(result.feePerGas).toBeObject()
    expect(result.feePerGas.low).toBeUndefined()
    expect(result.feePerGas.medium).toBeUndefined()
    expect(result.feePerGas.high).toBeNumber()
    expect(result.feePerGas.veryHigh).toBeUndefined()
    expect(result.priorityFeePerGas).toBeObject()
    expect(result.priorityFeePerGas.low).toBeUndefined()
    expect(result.priorityFeePerGas.medium).toBeUndefined()
    expect(result.priorityFeePerGas.high).toBeNumber()
    expect(result.priorityFeePerGas.veryHigh).toBeUndefined()
  })
  it('matches expected output', () => {
    const result = transformGasFromEthers(sampleEthersGas)
    expect(result).toMatchObject({
      baseFee: 13.547_863_64,
      feePerGas: { high: 28.395_724_162 },
      priorityFeePerGas: { high: 1.5 },
    })
  })
})
