export * from '@xyo-network/info-system-plugins'

import { SystemInfoPlugins } from '@xyo-network/info-system-plugins'
import { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemPlugins: PayloadSetPluginFunc[] = [...SystemInfoPlugins]

export default SystemPlugins
