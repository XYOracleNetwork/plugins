import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: { src: { entry: ['src/index-browser.ts'] } },
    neutral: { src: { entry: ['src/index-node.ts'] } },
    node: { src: { entry: ['src/index-node.ts'] } },
  },
}

export default config
