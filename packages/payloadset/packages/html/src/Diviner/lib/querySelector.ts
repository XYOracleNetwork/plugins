import { load } from 'cheerio'

const opts = {}
// const opts = { decodeEntities: false }

/**
 * Queries the html string and returns the first element that matches
 * the specified set of CSS selectors.
 * @param html The string of HTML to search
 * @param selector The CSS selector to search for
 * @returns An string representing the first element in the document
 * that matches the specified set of CSS selectors, or null is
 * returned if there are no matches.
 */
export const querySelector = (html: string, selector: string): string | null => {
  // Check if the input string is empty or null
  if (!html.trim()) return null
  // Parse the HTML
  const dom = load(html, opts)
  const element = dom(selector)
  return element.first()?.toString() || null
}
