import { describe, expect, it } from 'vitest'

import { querySelector } from '../querySelector.ts'

describe('querySelector', () => {
  describe('returns the first matching element from the supplied HTML', () => {
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
    const cases = [
      ['should find element by tag name', 'h1'],
      ['should find element by class name', '.description'],
      ['should find element by id', '#main'],
      ['should find multiple elements by class name', '.item'],
      ['should find element by attribute', 'input[name="username"]'],
      ['should find element by attribute with specific value', 'img[src="image.png"]'],
      ['should find element by attribute starts with', 'a[href^="/"]'],
      ['should find element by class and tag name combination', 'h1.title'],
      ['should find element by tag name inside another element', '#main h1'],
    ]
    it.each(cases)('%s', (_, selector) => {
      const result = querySelector(html, selector)
      expect(result).not.toBeEmpty()
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
