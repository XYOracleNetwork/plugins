import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: { src: { entry: ['index-browser.ts'] } },
    neutral: { src: { entry: ['index-node.ts'] } },
    node: { src: { entry: ['index-node.ts'] } },
  },
}

export default config
