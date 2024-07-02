import { hashUrl } from './util'
import { UrlWitness } from './Witness'

UrlWitness.hashUrl = hashUrl

// eslint-disable-next-line import/no-default-export
export { UrlPlugin as default, UrlPlugin } from './PluginNode'
export * from './Witness'
