export * from '@xyo-network/node-system-info-plugin'

import { NodeSystemInfoPlugin } from '@xyo-network/node-system-info-plugin'
import { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const SystemInfoPlugins: PayloadSetPluginFunc[] = [NodeSystemInfoPlugin]

// eslint-disable-next-line import-x/no-default-export
export default SystemInfoPlugins
