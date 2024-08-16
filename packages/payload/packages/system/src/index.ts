export * from '@xyo-network/info-system-payload-plugins'

import { SystemInfoPayloadPlugins } from '@xyo-network/info-system-payload-plugins'
import type { PayloadPluginFunc } from '@xyo-network/payload-plugin'

export const SystemPlugins: PayloadPluginFunc[] = [...SystemInfoPayloadPlugins]

// eslint-disable-next-line import-x/no-default-export
export default SystemPlugins
