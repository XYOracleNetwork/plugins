export * from '@xyo-network/file-browser-plugin'

import { BrowserFilePlugin } from '@xyo-network/file-browser-plugin'
import type { PayloadSetPluginFunc } from '@xyo-network/payloadset-plugin'

export const FilePlugins: PayloadSetPluginFunc[] = [BrowserFilePlugin]

// eslint-disable-next-line import-x/no-default-export
export default FilePlugins
