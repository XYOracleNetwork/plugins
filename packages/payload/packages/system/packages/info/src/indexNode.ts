export * from '@xyo-network/node-system-info-payload-plugin'

import { NodeSystemInfoPayloadPlugin } from '@xyo-network/node-system-info-payload-plugin'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const SystemInfoPayloadPlugins: PayloadPluginFunc[] = [NodeSystemInfoPayloadPlugin]

// eslint-disable-next-line import-x/no-default-export
export default SystemInfoPayloadPlugins
