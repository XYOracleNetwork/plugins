import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { CoingeckoCryptoMarketPayloadPlugin } from '../Plugin.ts'

describe('CoingeckoCryptoMarketPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = CoingeckoCryptoMarketPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
