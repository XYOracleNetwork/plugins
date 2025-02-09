import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import {
  sampleBlocknativeGas, sampleEtherchainGasV2, sampleEtherscanGas, sampleEthersGas, sampleEthgasstationGas,
} from '../../test/index.ts'
import { divineGas } from '../divineGas.ts'

describe('divineGas', () => {
  describe('with no payloads supplied', () => {
    it('divines gas', () => {
      const result = divineGas([])
      expect(result).toBeObject()
      expect(result.timestamp).toBeNumber()
    })
  })
  describe('with sparse payloads supplied', () => {
    it.each([[sampleEtherscanGas], [sampleEtherchainGasV2], [sampleEtherchainGasV2, sampleEtherscanGas]])('divines gas', (...payloads) => {
      const result = divineGas(payloads)
      expect(result).toBeObject()
      expect(result.timestamp).toBeNumber()
    })
  })
  describe('with one of each supported payload supplied', () => {
    it('divines gas', () => {
      const result = divineGas([sampleBlocknativeGas, sampleEtherchainGasV2, sampleEtherscanGas, sampleEthersGas, sampleEthgasstationGas])
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
      expect(result.timestamp).toBeNumber()
    })
  })
  describe('with multiple of each supported payload supplied', () => {
    it('divines gas', () => {
      const result = divineGas([
        sampleBlocknativeGas,
        sampleBlocknativeGas,
        sampleEtherchainGasV2,
        sampleEtherchainGasV2,
        sampleEtherscanGas,
        sampleEtherscanGas,
        sampleEthersGas,
        sampleEthersGas,
        sampleEthgasstationGas,
        sampleEthgasstationGas,
      ])
      expect(result).toBeObject()
      expect(result.timestamp).toBeNumber()
    })
  })
})
