import '@xylabs/vitest-extended'

import { PayloadSetPluginResolver } from '@xyo-network/payloadset-plugin'
import { getProviderFromEnv } from '@xyo-network/witness-blockchain-abstract'
import {
  describe, expect,
  test,
} from 'vitest'

import { EthereumGasEthersPlugin } from '../Plugin.ts'
import { EthereumGasEthersWitness } from '../Witness.ts'

const projectId = process.env.INFURA_PROJECT_ID || ''
const projectSecret = process.env.INFURA_PROJECT_SECRET || ''

describe('EthereumGasEthersPlugin', () => {
  test.skipIf(!(projectId && projectSecret))('Add to Resolver', async () => {
    const provider = getProviderFromEnv()
    const plugin = EthereumGasEthersPlugin()
    const resolver = await new PayloadSetPluginResolver().register(plugin, {
      config: { schema: EthereumGasEthersWitness.defaultConfigSchema },
      provider,
    })
    expect(await resolver.resolve(plugin.set)).toBeObject()
    expect(await resolver.witness(plugin.set)).toBeObject()
  })
})
