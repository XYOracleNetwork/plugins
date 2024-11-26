import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { EvmAddressPayloadPlugin } from '../Plugin.ts'

describe('EvmAddressPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EvmAddressPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
