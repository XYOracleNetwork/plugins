import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { UniswapCryptoMarketPlugin } from '../Plugin.ts'

describe('CryptoMarketUniswapPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = UniswapCryptoMarketPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
