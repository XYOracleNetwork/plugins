import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { CryptoCardsGamePayloadPlugin } from '../Plugin.ts'

describe('CryptoCardsGamePayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = CryptoCardsGamePayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
