import '@xylabs/vitest-extended'

import { asSchema } from '@xyo-network/payload-model'
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
      const result = isEthereumGasEthersPayload({ schema: asSchema('network.xyo.debug', true) })
      expect(result).toBeFalse()
    })
    it('when payload is missing', () => {
      const result = isEthereumGasEthersPayload()
      expect(result).toBeFalse()
    })
    it('when payload is undefined', () => {
      const result = isEthereumGasEthersPayload()
      expect(result).toBeFalse()
    })
    it('when payload is null', () => {
      const result = isEthereumGasEthersPayload(null)
      expect(result).toBeFalse()
    })
  })
})
