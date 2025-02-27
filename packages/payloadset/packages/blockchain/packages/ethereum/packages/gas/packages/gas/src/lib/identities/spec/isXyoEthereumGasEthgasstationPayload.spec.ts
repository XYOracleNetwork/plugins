import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import { sampleEthgasstationGas } from '../../../test/index.ts'
import { isEthereumGasEthgasstationPayload } from '../isEthereumGasEthgasstationPayload.ts'

describe('isEthereumGasEthgasstationPayload', () => {
  describe('returns true', () => {
    it('when payload schema is EthereumGasEthgasstationSchema', () => {
      const result = isEthereumGasEthgasstationPayload(sampleEthgasstationGas)
      expect(result).toBeTrue()
    })
  })
  describe('returns false', () => {
    it('when payload schema is not EthereumGasEthgasstationSchema', () => {
      const result = isEthereumGasEthgasstationPayload({ schema: 'network.xyo.debug' })
      expect(result).toBeFalse()
    })
    it('when payload is missing', () => {
      const result = isEthereumGasEthgasstationPayload()
      expect(result).toBeFalse()
    })
    it('when payload is undefined', () => {
      const result = isEthereumGasEthgasstationPayload()
      expect(result).toBeFalse()
    })
    it('when payload is null', () => {
      const result = isEthereumGasEthgasstationPayload(null)
      expect(result).toBeFalse()
    })
  })
})
