import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, test,
} from 'vitest'
import { priceFromUniswap4 } from '../priceFromUniswap4.ts'
import { UniswapV4Pools } from '../UniswapV4TokenContracts.ts'

describe.skipIf(!(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET))('priceFromUniswap4', () => {
  test('priceFromUniswap4', async () => {
    const provider = getProviderFromEnv()
    const poolId = UniswapV4Pools['XYO:USDT']
    const pairs = await priceFromUniswap4(poolId, provider)
    expect(pairs).toBeDefined()
    console.dir(pairs, { depth: null })
  })
})
