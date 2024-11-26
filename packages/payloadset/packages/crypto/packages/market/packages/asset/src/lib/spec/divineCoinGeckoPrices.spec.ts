import '@xylabs/vitest-extended'

import { assertEx } from '@xylabs/assert'
import {
  describe, expect,
  it,
} from 'vitest'

import { sampleCoinGeckoPayload } from '../../test/index.ts'
import { divineCoinGeckoPrices } from '../divineCoinGeckoPrices.ts'

describe('divineCoinGeckoPrices', () => {
  it('divines prices from CoinGecko', async () => {
    const result = await divineCoinGeckoPrices(sampleCoinGeckoPayload)
    expect(result.assets).toBeObject()
    const assets = assertEx(result.assets)
    Object.entries(assets).map(([token, assetInfo]) => {
      expect(token).toBeString()
      expect(assetInfo).toBeObject()
      const value = assertEx(assetInfo?.value)
      expect(value).toBeObject()
      Object.entries(value).map(([symbol, price]) => {
        expect(symbol).toBeString()
        expect(price).toBeString()
        const parsed = Number.parseFloat(price)
        expect(parsed).toBeNumber()
        expect(Number.isNaN(parsed)).toBeFalse()
      })
    })
    expect(result?.assets?.xyo?.value?.btc).toBe('6.28282e-7')
    expect(result?.assets?.xyo?.value?.eth).toBe('0.00000885')
    expect(result?.assets?.xyo?.value?.eur).toBe('0.01417995')
    expect(result?.assets?.xyo?.value?.usd).toBe('0.01439307')
  })
})
