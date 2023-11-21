import { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {
      src: {
        entry: ['src/indexBrowser.ts'],
      },
    },
    node: {
      src: {
        entry: ['src/indexNode.ts'],
      },
    },
  },
}

// eslint-disable-next-line import/no-default-export
export default config
