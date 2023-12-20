import { PayloadPluginResolver } from '@xyo-network/payload-plugin'

import { EvmAddressPayloadPlugin } from '../Plugin'

describe('EvmAddressPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = EvmAddressPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
