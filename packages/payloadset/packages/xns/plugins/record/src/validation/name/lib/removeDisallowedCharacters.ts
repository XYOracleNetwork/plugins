import { DisallowedModuleIdentifierCharacters } from '@xyo-network/module-model'

const DISALLOWED_CHARACTERS = new Set(Object.keys(DisallowedModuleIdentifierCharacters))

/**
 * Iterates over a string removing disallowed characters
 * @param xnsName The XNS name to remove disallowed characters from
 * @returns The XNS name with disallowed characters removed
 */
export const removeDisallowedCharacters = (xnsName: string): string => {
  let result = ''
  for (const char of xnsName) {
    if (!DISALLOWED_CHARACTERS.has(char)) {
      result += char
    }
  }
  return result
}
