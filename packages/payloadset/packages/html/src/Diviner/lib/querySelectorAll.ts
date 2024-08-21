import { load } from 'cheerio'

const opts = {}
// const opts = { decodeEntities: false }

/**
 * Queries the html string and returns all elements that match
 * the specified set of CSS selectors.
 * @param html The string of HTML to search
 * @param selector The CSS selector to search for
 * @returns An array of strings representing the elements in the
 * document that match the specified set of CSS selectors, or null is
 * returned if there are no matches.
 */
export const querySelectorAll = (html: string, selectors: string): string[] => {
  const results: string[] = []
  // Check if the input string is empty or null
  if (!html.trim()) return results
  // Parse the HTML
  const dom = load(html, opts)
  const elements = dom(selectors) as unknown as ReturnType<typeof dom>[]
  for (const element of elements) {
    results.push(dom(element).toString())
  }
  return results
}
