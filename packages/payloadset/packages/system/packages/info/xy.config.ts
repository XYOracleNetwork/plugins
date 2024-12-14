import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: { 'src/browser': true },
    node: { 'src/node': true },
  },
}

export default config
