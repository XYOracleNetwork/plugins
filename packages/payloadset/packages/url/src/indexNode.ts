import { UrlPlugin } from './PluginNode'
import { hashUrl } from './util'
import { UrlWitness } from './Witness'
export * from './Witness'

UrlWitness.hashUrl = hashUrl

export { UrlPlugin }

// eslint-disable-next-line import/no-default-export
export default UrlPlugin
