import { PayloadPluginResolver } from '@xyo-network/payload-plugin'

import { TZeroStockMarketPayloadPlugin } from '../Plugin'

describe('CoingeckoCryptoMarketPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = TZeroStockMarketPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
