import { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    browser: {
      src: true,
    },

    node: {},
    neutral: {},
  },
}

// eslint-disable-next-line import-x/no-default-export
export default config
