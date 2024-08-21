import { describe, expect, it } from 'vitest'

import { querySelectorAll } from '../querySelectorAll.ts'

describe('querySelectorAll', () => {
  const html = `
  <div id="main" class="container">
    <h1 class="title">Hello, World!</h1>
    <p class="description">This is a test paragraph.</p>
    <a href="/link" class="link">Click Here</a>
    <ul>
      <li class="item">Item 1</li>
      <li class="item">Item 2</li>
      <li class="item">Item 3</li>
    </ul>
    <input type="text" name="username" value="testUser" />
    <img src="image.png" alt="Test Image" />
  </div>
`
  describe('returns the first matching element from the supplied HTML', () => {
    it('should return first matching element when multiple elements match', () => {
      const selector = '.item'
      const result = querySelectorAll(html, selector)
      expect(result).not.toBeNull()
      expect(result.length).toBe(3)
      expect(result).toEqual([
        '<li class="item">Item 1</li>',
        '<li class="item">Item 2</li>',
        '<li class="item">Item 3</li>',
      ])
    })
  })
  describe('returns empty array', () => {
    it('with empty selector', () => {
      const result = querySelectorAll('<div><p>Test</p></div>', '')
      expect(result).toEqual([])
    })
    it('with empty html', () => {
      const result = querySelectorAll('', '*')
      expect(result).toEqual([])
    })
    it('with empty selector and empty html', () => {
      const result = querySelectorAll('', '')
      expect(result).toEqual([])
    })
    it('with no matching data', () => {
      const result = querySelectorAll('<div><p>Test</p></div>', 'h1')
      expect(result).toEqual([])
    })
  })
})
