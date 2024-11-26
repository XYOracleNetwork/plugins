import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { NftIdPayloadPlugin } from '../Plugin.ts'

describe('NftIdPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = NftIdPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
