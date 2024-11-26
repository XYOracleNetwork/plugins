import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { NftCollectionInfoPayloadPlugin } from '../Plugin.ts'

describe('NftCollectionInfoPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = NftCollectionInfoPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
