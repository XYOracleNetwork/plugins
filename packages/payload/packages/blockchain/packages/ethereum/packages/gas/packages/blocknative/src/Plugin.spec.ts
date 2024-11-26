import { extend } from '@xylabs/vitest-extended'
import { PayloadPluginResolver } from '@xyo-network/payload-plugin'
import {
  describe, expect, test,
} from 'vitest'

import { EthereumGasBlocknativePayloadPlugin } from './Plugin.ts'

describe('EthereumGasBlocknativePayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EthereumGasBlocknativePayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
