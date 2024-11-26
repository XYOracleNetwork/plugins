import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import {
  describe, expect,
  test,
} from 'vitest'

import { NftScoreDivinerPlugin } from '../Plugin.ts'

describe('NftScoreDivinerPlugin', () => {
  test('Add to Resolver', async () => {
    const plugin = NftScoreDivinerPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.set)).toBeDefined()
  })
})
