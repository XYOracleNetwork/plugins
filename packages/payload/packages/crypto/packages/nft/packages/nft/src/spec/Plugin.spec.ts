import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { NftInfoPayloadPlugin } from '../Plugin.ts'

describe('NftInfoPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = NftInfoPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
