import { assertEx } from '@xylabs/assert'
import { ApiCallResultSchema, ApiCallSchema, ApiCallWitness, ApiCallWitnessConfigSchema, isApiCallXmlResult } from '@xyo-network/api-call-witness'

import { isXmlWithMeta } from '../../Payload'
import { XmlSchema } from '../../Schema'
import { XmlParsingDiviner } from '../Diviner'
import { XmlParsingDivinerConfigSchema } from '../Schema'

describe('XmlParsingDiviner', () => {
  const uri = 'https://medium.com/feed/xyonetwork'
  describe('observe', () => {
    it('parses XML from API response', async () => {
      const witness = await ApiCallWitness.create({
        account: 'random',
        config: { accept: 'text/xml', schema: ApiCallWitnessConfigSchema },
      })
      const diviner = await XmlParsingDiviner.create({
        account: 'random',
        config: { schema: XmlParsingDivinerConfigSchema },
      })
      const observations = await witness.observe([{ schema: ApiCallSchema, uri }])
      expect(observations).toBeArrayOfSize(1)
      const observation = observations.find(isApiCallXmlResult)
      expect(observation).toBeDefined()
      expect(observation).toBeObject()
      expect(observation?.schema).toBe(ApiCallResultSchema)
      const xml = assertEx(observation, () => 'Error in observation')
      const results = await diviner.divine([xml])
      expect(results).toBeArrayOfSize(1)
      const result = results.find(isXmlWithMeta)
      expect(result).toBeDefined()
      expect(result?.schema).toBe(XmlSchema)
      expect(result?.xml).toBeDefined()
      expect(result?.xml).toBeObject()
    })
  })
})
