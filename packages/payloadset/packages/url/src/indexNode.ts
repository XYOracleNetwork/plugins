import { hashUrl } from './util/index.ts'
import { UrlWitness } from './Witness/index.ts'

UrlWitness.hashUrl = hashUrl

// eslint-disable-next-line import/no-default-export
export { UrlPlugin as default, UrlPlugin } from './PluginNode.ts'
export * from './Witness/index.ts'
