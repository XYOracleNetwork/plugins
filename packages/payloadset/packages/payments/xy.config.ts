import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {},
    node: {},
    neutral: { src: true },
  },
}

// eslint-disable-next-line import-x/no-default-export
export default config
