import { parseEstimatesFromArray } from '../parseEstimatesFromArray.ts'

describe('parseEstimatesFromArray', () => {
  describe('with valid data', () => {
    const data = [

    ]
    it('parses estimates from array', async () => {
      expect(await parseEstimatesFromArray([])).toMatchSnapshot()
    })
  })
})
