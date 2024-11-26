import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { BowserSystemInfoPayloadPlugin } from '../Plugin.ts'

describe('BowserSystemInfoPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = BowserSystemInfoPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
