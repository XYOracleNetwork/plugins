import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import { sampleEthersGas } from '../../../test/index.ts'
import { isEthereumGasEthersPayload } from '../isEthereumGasEthersPayload.ts'

describe('isEthereumGasEthersPayload', () => {
  describe('returns true', () => {
    it('when payload schema is EthereumGasEthersSchema', () => {
      const result = isEthereumGasEthersPayload(sampleEthersGas)
      expect(result).toBeTrue()
    })
  })
  describe('returns false', () => {
    it('when payload schema is not EthereumGasEthersSchema', () => {
      const result = isEthereumGasEthersPayload({ schema: 'network.xyo.debug' })
      expect(result).toBeFalse()
    })
    it('when payload is missing', () => {
      const result = isEthereumGasEthersPayload()
      expect(result).toBeFalse()
    })
    it('when payload is undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = isEthereumGasEthersPayload(undefined)
      expect(result).toBeFalse()
    })
    it('when payload is null', () => {
      const result = isEthereumGasEthersPayload(null)
      expect(result).toBeFalse()
    })
  })
})
