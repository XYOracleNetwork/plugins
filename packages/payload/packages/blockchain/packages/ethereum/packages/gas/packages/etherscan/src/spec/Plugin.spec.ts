import '@xylabs/vitest-extended'

import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { EthereumGasEtherscanPayloadPlugin } from '../Plugin.ts'

describe('EthereumGasEtherscanPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EthereumGasEtherscanPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
