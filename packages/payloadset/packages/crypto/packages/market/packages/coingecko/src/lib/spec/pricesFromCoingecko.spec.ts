import '@xylabs/vitest-extended'

import {
  describe, expect,
  test,
} from 'vitest'

import { defaultCoins, defaultCurrencies } from '../defaults.ts'
import { pricesFromCoingecko } from '../pricesFromCoingecko.ts'

describe('pricesFromCoingecko', () => {
  test('observe', async () => {
    const assets = await pricesFromCoingecko(defaultCoins, defaultCurrencies)
    expect(assets.btc?.btc).toBe(1)
  })
})
