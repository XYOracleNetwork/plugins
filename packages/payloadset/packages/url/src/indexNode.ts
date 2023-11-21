import { UrlPlugin } from './PluginNode'
import { hashUrl } from './util'
import { UrlWitness } from './Witness'

UrlWitness.hashUrl = hashUrl

export { UrlPlugin, UrlWitness }

// eslint-disable-next-line import/no-default-export
export default UrlPlugin
