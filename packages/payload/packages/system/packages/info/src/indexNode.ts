export * from '@xyo-network/node-system-info-payload-plugin'

import { NodeSystemInfoPayloadPlugin } from '@xyo-network/node-system-info-payload-plugin'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const SystemInfoPayloadPlugins: PayloadPluginFunc[] = [NodeSystemInfoPayloadPlugin]

export default SystemInfoPayloadPlugins
