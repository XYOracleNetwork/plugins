import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { EthereumGasEthersPayloadPlugin } from '../Plugin.ts'

describe('EthereumGasEthersPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EthereumGasEthersPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
