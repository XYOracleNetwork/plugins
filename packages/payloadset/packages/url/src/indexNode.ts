import { hashUrl } from './util'
import { UrlWitness } from './Witness'

UrlWitness.hashUrl = hashUrl

export { UrlPlugin as default, UrlPlugin } from './PluginNode'
export * from './Witness'
