import { hashUrl } from './util/index.js'
import { UrlWitness } from './Witness/index.js'

UrlWitness.hashUrl = hashUrl

// eslint-disable-next-line import/no-default-export
export { UrlPlugin as default, UrlPlugin } from './PluginNode.js'
export * from './Witness/index.js'
