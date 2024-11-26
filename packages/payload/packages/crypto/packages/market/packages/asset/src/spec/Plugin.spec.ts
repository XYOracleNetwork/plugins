import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { CryptoMarketAssetPayloadPlugin } from '../Plugin.ts'

describe('CryptoMarketAssetPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = CryptoMarketAssetPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
