export * from '@xyo-network/node-system-info-plugin'

import { NodeSystemInfoPlugin } from '@xyo-network/node-system-info-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemInfoPlugins: PayloadSetPluginFunc[] = [NodeSystemInfoPlugin]

export default SystemInfoPlugins
