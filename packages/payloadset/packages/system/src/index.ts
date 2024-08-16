export * from '@xyo-network/info-system-plugins'

import { SystemInfoPlugins } from '@xyo-network/info-system-plugins'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemPlugins: PayloadSetPluginFunc[] = [...SystemInfoPlugins]

// eslint-disable-next-line import-x/no-default-export
export default SystemPlugins
