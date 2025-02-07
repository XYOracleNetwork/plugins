import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import { sampleCoinGeckoPayload, sampleUniswapPayload } from '../../test/index.ts'
import { divinePrices } from '../divinePrices.ts'

describe('divinePrices', () => {
  it('divines prices', () => {
    const result = divinePrices(sampleCoinGeckoPayload, sampleUniswapPayload)
    expect(result).toBeObject()
    expect(result.timestamp).toBeNumber()
    expect(result.assets.xyo?.value.btc).toBe('6.415295e-7')
    expect(result.assets.xyo?.value.eth).toBe('0.000008908865')
    expect(result.assets.xyo?.value.eur).toBe('0.01417995')
    expect(result.assets.xyo?.value.usd).toBe('0.014635635000000001')
  })
})
