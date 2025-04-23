import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, test,
} from 'vitest'

import { priceFromUniswapV4 } from '../priceFromUniswapV4.ts'
import { UniswapV4DefaultPools } from '../UniswapV4DefaultPools.ts'

describe.skipIf(!(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET))('priceFromUniswapV4', () => {
  test('priceFromUniswapV4', async () => {
    const provider = getProviderFromEnv()
    const poolId = UniswapV4DefaultPools['XYO:USDT']
    const pairs = await priceFromUniswapV4(poolId, provider)
    expect(pairs).toBeDefined()
    console.dir(pairs, { depth: null })
  })
})
