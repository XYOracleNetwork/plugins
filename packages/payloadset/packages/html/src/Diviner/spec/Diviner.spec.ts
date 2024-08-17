import { assertEx } from '@xylabs/assert'
import { ApiCallResultSchema, ApiCallSchema, ApiCallWitness, ApiCallWitnessConfigSchema, isApiCallXmlResult } from '@xyo-network/api-call-witness'

import { isHtmlWithMeta } from '../../Payload.ts'
import { HtmlSchema } from '../../Schema.ts'
import { HtmlQuerySelectorDiviner } from '../Diviner.ts'
import { HtmlQuerySelectorDivinerConfigSchema } from '../Schema.ts'

describe('HtmlParsingDiviner', () => {
  const uri = 'https://medium.com/feed/xyonetwork'
  describe('observe', () => {
    it('parses XML from API response', async () => {
      const witness = await ApiCallWitness.create({
        account: 'random',
        config: { accept: 'text/html', schema: ApiCallWitnessConfigSchema },
      })
      const diviner = await HtmlQuerySelectorDiviner.create({
        account: 'random',
        config: { schema: HtmlQuerySelectorDivinerConfigSchema, querySelector: 'titlebody > title' },
      })
      const observations = await witness.observe([{ schema: ApiCallSchema, uri }])
      expect(observations).toBeArrayOfSize(1)
      // TODO: Add HTML result identity function
      const observation = observations.find(isApiCallXmlResult)
      expect(observation).toBeDefined()
      expect(observation).toBeObject()
      expect(observation?.schema).toBe(ApiCallResultSchema)
      const html = assertEx(observation, () => 'Error in observation')
      const results = await diviner.divine([html])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isHtmlWithMeta)
      expect(result).toBeDefined()
      expect(result?.schema).toBe(HtmlSchema)
      expect(result?.html).toBeDefined()
      expect(result?.html).toBeObject()
    })
  })
})
