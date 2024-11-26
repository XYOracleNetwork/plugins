import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { LocationPayloadPlugin } from '../Plugin.ts'

describe('LocationPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = LocationPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
