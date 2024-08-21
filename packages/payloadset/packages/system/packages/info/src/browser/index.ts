export * from '@xyo-network/bowser-system-info-plugin'

import { BowserSystemInfoPlugin } from '@xyo-network/bowser-system-info-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemInfoPlugins: PayloadSetPluginFunc[] = [BowserSystemInfoPlugin]

// eslint-disable-next-line import-x/no-default-export
export default SystemInfoPlugins
