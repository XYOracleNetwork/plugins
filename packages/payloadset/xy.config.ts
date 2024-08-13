import { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {
      src: {
        entry: ['src/indexBrowser.ts'],
      },
    },
    neutral: {
      src: {
        entry: ['src/indexNode.ts'],
      },
    },
    node: {
      src: {
        entry: ['src/indexNode.ts'],
      },
    },
  },
}

// eslint-disable-next-line import-x/no-default-export
export default config
