import '@xylabs/vitest-extended'

import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect, test,
} from 'vitest'

import { createUniswapPoolContracts } from '../v3/index.ts'
import { pricesFromUniswap3 } from '../pricesFromUniswap3.ts'
import { UniswapPoolContracts } from '../UniswapPoolContracts.ts'

describe.skipIf(!(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET))('pricesFromUniswap3', () => {
  test('observe', async () => {
    const provider = getProviderFromEnv()
    const pairs = await pricesFromUniswap3(createUniswapPoolContracts(provider, UniswapPoolContracts))
    expect(pairs.length).toBeGreaterThan(1)
  })
})
