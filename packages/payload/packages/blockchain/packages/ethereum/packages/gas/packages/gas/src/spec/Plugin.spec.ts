import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { EthereumGasPayloadPlugin } from '../Plugin.ts'

describe('EthereumGasPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EthereumGasPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
