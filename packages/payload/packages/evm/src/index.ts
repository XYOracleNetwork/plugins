export * from '@xyo-network/evm-address-payload-plugin'
import { EvmAddressPayloadPlugin } from '@xyo-network/evm-address-payload-plugin'
import { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const EvmPayloadPlugins: PayloadPluginFunc[] = [EvmAddressPayloadPlugin]

export default EvmPayloadPlugins
