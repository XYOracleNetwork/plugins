import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { NftCollectionScoreDivinerPlugin } from '../Plugin.ts'

describe('NftCollectionScoreDivinerPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = NftCollectionScoreDivinerPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
