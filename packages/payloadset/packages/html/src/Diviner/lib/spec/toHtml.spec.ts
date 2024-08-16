import { toHtml } from '../toHtml.ts'

describe('toHtml', () => {
  const cases = [
    {
      data: '',
      schema: 'network.xyo.payload',
    },
  ]
  it.each(cases)('parses string to Html', async (data) => {
    const result = await toHtml(data)
    expect(result).toMatchSnapshot()
  })
})
