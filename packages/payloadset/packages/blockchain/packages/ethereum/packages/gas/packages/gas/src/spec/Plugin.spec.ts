import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasPlugin } from '../Plugin.ts'

describe('CryptoMarketCoinGeckoPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = EthereumGasPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
