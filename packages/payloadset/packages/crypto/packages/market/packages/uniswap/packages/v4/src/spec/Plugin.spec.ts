import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { UniswapV4CryptoMarketPlugin } from '../Plugin.ts'

describe('CryptoMarketUniswapPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = UniswapV4CryptoMarketPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
