import { DisallowedModuleIdentifierCharacters } from '@xyo-network/module-model'

// Escaping special regex characters in the disallowed keys
export const escapeRegex = (str: string) => str.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)

// Escaping and then creating the regex
export const disallowedCharsPattern = Object.keys(DisallowedModuleIdentifierCharacters)
  .map(escapeRegex)
  .join('')

// Creating the final regex
export const REMOVE_DISALLOWED_CHARS = new RegExp(`[${disallowedCharsPattern}]`, 'g')
