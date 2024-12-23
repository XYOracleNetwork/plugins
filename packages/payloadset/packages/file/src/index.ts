export * from '@xyo-network/file-browser-plugin'

import { BrowserFilePlugin } from '@xyo-network/file-browser-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const FilePlugins: PayloadSetPluginFunc[] = [BrowserFilePlugin]

export default FilePlugins
