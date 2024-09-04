import { DisallowedModuleIdentifierCharacters } from '@xyo-network/module-model'

/**
 * A set of all the disallowed characters in module identifiers
 */
const DISALLOWED_CHARACTERS = new Set(Object.keys(DisallowedModuleIdentifierCharacters))

/**
 * Iterates over a string removing disallowed characters
 * @param xnsName The XNS name to remove disallowed characters from
 * @returns The XNS name with disallowed characters removed
 */
export const removeDisallowedCharacters = (xnsName: string): string => {
  // Create the initial result
  let result = ''
  // Iterate over each character in the XNS name
  for (const char of xnsName) {
    // If the character is not a disallowed character
    if (!DISALLOWED_CHARACTERS.has(char)) {
      // add it to the result
      result += char
    }
  }
  // Return the result which contains only allowed characters
  return result
}
