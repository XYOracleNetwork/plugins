import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: { src: { entry: ['indexBrowser.ts'] } },
    neutral: { src: { entry: ['indexNode.ts'] } },
    node: { src: { entry: ['indexNode.ts'] } },
  },
}

export default config
