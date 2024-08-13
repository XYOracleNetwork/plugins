export * from '@xyo-network/evm-address-payload-plugin'
import { EvmAddressPayloadPlugin } from '@xyo-network/evm-address-payload-plugin'
import { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const EvmPayloadPlugins: PayloadPluginFunc[] = [EvmAddressPayloadPlugin]

// eslint-disable-next-line import-x/no-default-export
export default EvmPayloadPlugins
