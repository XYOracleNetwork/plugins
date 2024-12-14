export * from '@xyo-network/bowser-system-info-plugin'

import { BowserSystemInfoPlugin } from '@xyo-network/bowser-system-info-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemInfoPlugins: PayloadSetPluginFunc[] = [BowserSystemInfoPlugin]

export default SystemInfoPlugins
