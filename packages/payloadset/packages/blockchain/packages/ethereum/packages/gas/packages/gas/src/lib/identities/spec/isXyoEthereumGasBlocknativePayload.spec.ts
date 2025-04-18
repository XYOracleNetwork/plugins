import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import { sampleBlocknativeGas } from '../../../test/index.ts'
import { isEthereumGasBlocknativePayload } from '../isEthereumGasBlocknativePayload.ts'

describe('isEthereumGasBlocknativePayload', () => {
  describe('returns true', () => {
    it('when payload schema is EthereumGasBlocknativeSchema', () => {
      const result = isEthereumGasBlocknativePayload(sampleBlocknativeGas)
      expect(result).toBeTrue()
    })
  })
  describe('returns false', () => {
    it('when payload schema is not EthereumGasBlocknativeSchema', () => {
      const result = isEthereumGasBlocknativePayload({ schema: 'network.xyo.debug' })
      expect(result).toBeFalse()
    })
    it('when payload is missing', () => {
      const result = isEthereumGasBlocknativePayload()
      expect(result).toBeFalse()
    })
    it('when payload is undefined', () => {
      const result = isEthereumGasBlocknativePayload()
      expect(result).toBeFalse()
    })
    it('when payload is null', () => {
      const result = isEthereumGasBlocknativePayload(null)
      expect(result).toBeFalse()
    })
  })
})
