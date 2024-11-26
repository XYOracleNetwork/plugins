import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { PentairScreenlogicPayloadPlugin } from '../Plugin.ts'

describe('PentairScreenlogicPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = PentairScreenlogicPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
