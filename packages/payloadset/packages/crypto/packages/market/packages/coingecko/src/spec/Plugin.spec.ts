import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { CoingeckoCryptoMarketPlugin } from '../Plugin.ts'

describe('CryptoMarketCoinGeckoPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = CoingeckoCryptoMarketPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(await resolver.resolve(plugin.set)).toBeDefined()
  })
})
