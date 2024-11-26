import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { CryptoCardsMovePayloadPlugin } from '../Plugin.ts'

describe('CryptoCardsMovePayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = CryptoCardsMovePayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
