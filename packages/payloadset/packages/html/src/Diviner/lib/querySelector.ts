import { exists } from '@xylabs/exists'
import { load } from 'cheerio'

const opts = {}
// const opts = { decodeEntities: false }

/**
 * Takes a string data field containing html and converts it to an XML object
 * @param html The input object which contains the stringified html data
 * @returns A promise that resolves to an XML payload
 */
export const querySelector = (html: string, selector: string): string | null => {
  // Check if the input string is empty or null
  if (!html.trim()) return null
  // Parse the HTML
  const dom = load(html, opts)
  const element = dom(selector)
  // TODO: .toString() instead of .html()?
  return element.html()
}

export const querySelectorAll = (html: string, selectors: string): string[] => {
  // Check if the input string is empty or null
  if (!html.trim()) return []
  // Parse the HTML
  const dom = load(html, opts)
  const elements = dom(selectors) as unknown as ReturnType<typeof dom>[]
  return elements.map(element => element.html()).filter(exists)
}
