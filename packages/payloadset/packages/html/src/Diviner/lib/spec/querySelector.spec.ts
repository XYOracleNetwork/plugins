import { querySelector } from '../querySelector.ts'

describe('querySelector', () => {
  describe('returns the first matching element from the supplied HTML', () => {
    const cases = [
    // Case 1: Empty HTML string and non-empty selector
      [
        '', // Empty HTML data
        'div', // Selector trying to find a div
      ],
      // Case 2: Non-empty HTML string but empty selector
      [
        '<div><p>Test</p></div>', // Valid HTML data
        '', // Empty selector
      ],
      // Case 3: Both empty HTML string and empty selector
      [
        '', // Empty HTML data
        '', // Empty selector
      ],
    ]
    it.each(cases)('with valid selector and matching data', (html, selector) => {
      const result = querySelector(html, selector)
      expect(result).toMatchSnapshot()
    })
  })
  describe('returns null', () => {
    it('with empty selector', () => {
      const result = querySelector('<div><p>Test</p></div>', '')
      expect(result).toBeNull()
    })
    it('with empty html', () => {
      const result = querySelector('', '*')
      expect(result).toBeNull()
    })
    it('with empty selector and empty html', () => {
      const result = querySelector('', '')
      expect(result).toBeNull()
    })
    it('with no matching data', () => {
      const result = querySelector('<div><p>Test</p></div>', 'h1')
      expect(result).toBeNull()
    })
  })
})
