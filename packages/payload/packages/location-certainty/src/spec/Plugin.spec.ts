import { PayloadPluginResolver } from '@xyo-network/payload-plugin'

import { LocationCertaintyPayloadPlugin } from '../Plugin'

describe('LocationCertaintyPayloadPlugin', () => {
  test('Add to Resolver', () => {
    const plugin = LocationCertaintyPayloadPlugin()
    const resolver = new PayloadPluginResolver().register(plugin)
    expect(resolver.resolve(plugin.schema)).toBeObject()
  })
})
