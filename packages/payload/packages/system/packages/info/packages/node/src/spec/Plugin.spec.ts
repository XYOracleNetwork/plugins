import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { NodeSystemInfoPayloadPlugin } from '../Plugin.ts'

describe('BrowserSystemInfoPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = NodeSystemInfoPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
