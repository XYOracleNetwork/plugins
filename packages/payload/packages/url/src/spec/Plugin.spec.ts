import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { UrlPayloadPlugin } from '../Plugin.ts'

describe('UrlPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = UrlPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
