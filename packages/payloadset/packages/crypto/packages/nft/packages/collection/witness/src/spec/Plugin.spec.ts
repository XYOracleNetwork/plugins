import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { CryptoNftCollectionWitnessPlugin } from '../Plugin.ts'

describe('CryptoNftCollectionWitnessPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = CryptoNftCollectionWitnessPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
