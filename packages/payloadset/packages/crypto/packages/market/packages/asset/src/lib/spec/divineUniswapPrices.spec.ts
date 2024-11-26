import '@xylabs/vitest-extended'

import {
  describe, expect,
  it,
} from 'vitest'

import { sampleUniswapPayload } from '../../test/index.ts'
import { divineUniswapPrices } from '../divineUniswapPrices.ts'

describe('divineUniswapPrices', () => {
  it('divines prices from Uniswap', async () => {
    const result = await divineUniswapPrices(sampleUniswapPayload)
    expect(result).toBeObject()
    expect(result?.assets?.xyo?.value?.btc).toBe('6.54777e-7')
    expect(result?.assets?.xyo?.value?.eth).toBe('0.00000896773')
    expect(result?.assets?.xyo?.value?.eur).toBe(undefined)
    expect(result?.assets?.xyo?.value?.usd).toBe('0.0148782')
  })
})
