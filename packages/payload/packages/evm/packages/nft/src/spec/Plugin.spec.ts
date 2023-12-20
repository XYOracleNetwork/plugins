import { PayloadPluginResolver } from '@xyo-network/payload-plugin'

import { NftIdPayloadPlugin } from '../Plugin'

describe('NftIdPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = NftIdPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
