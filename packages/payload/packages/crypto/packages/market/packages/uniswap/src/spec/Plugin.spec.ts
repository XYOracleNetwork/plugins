import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { UniswapCryptoMarketPayloadPlugin } from '../Plugin.ts'

describe('UniswapCryptoMarketPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = UniswapCryptoMarketPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
