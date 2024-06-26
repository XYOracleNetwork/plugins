export * from '@xyo-network/info-system-payload-plugins'

import { SystemInfoPayloadPlugins } from '@xyo-network/info-system-payload-plugins'
import { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const SystemPlugins: PayloadPluginFunc[] = [...SystemInfoPayloadPlugins]

export default SystemPlugins
