export * from '@xyo-network/blockchain-payload-plugins'
export * from '@xyo-network/crypto-payload-plugins'
export * from '@xyo-network/elevation-payload-plugin'
export * from '@xyo-network/image-thumbnail-payload-plugin'
export * from '@xyo-network/location-certainty-payload-plugin'
export * from '@xyo-network/location-payload-plugin'
export * from '@xyo-network/module-instance-payload-plugin'
export * from '@xyo-network/pentair-payload-plugin'
export * from '@xyo-network/url-payload-plugin'
export * from '@xyo-network/url-safety-payload-plugin'

import { BlockchainPayloadPlugins } from '@xyo-network/blockchain-payload-plugins'
import { CryptoPayloadPlugins } from '@xyo-network/crypto-payload-plugins'
import { LocationCertaintyPayloadPlugin } from '@xyo-network/location-certainty-payload-plugin'
import { LocationPayloadPlugin } from '@xyo-network/location-payload-plugin'
import { ModuleInstancePayloadPlugin } from '@xyo-network/module-instance-payload-plugin'
import { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const PayloadPlugins: PayloadPluginFunc[] = [
  LocationPayloadPlugin,
  LocationCertaintyPayloadPlugin,
  ModuleInstancePayloadPlugin,
  ...BlockchainPayloadPlugins,
  ...CryptoPayloadPlugins,
]

export default PayloadPlugins
