import { ApiCallResultSchema, ApiCallSchema, ApiCallWitness, ApiCallWitnessConfigSchema, isApiCallErrorResult } from '@xyo-network/api-call-witness'
import { PayloadSchema } from '@xyo-network/payload-model'

import { XmlParsingDiviner } from '../Diviner'
import { XmlParsingDivinerConfigSchema } from '../Schema'

describe('XmlParsingDiviner', () => {
  const uri = 'https://medium.com/feed/xyonetwork'
  describe('observe', () => {
    it('parses XML from API response', async () => {
      const witness = await ApiCallWitness.create({
        account: 'random',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: { accept: 'text/xml' as any, schema: ApiCallWitnessConfigSchema },
      })
      const diviner = await XmlParsingDiviner.create({
        account: 'random',
        config: { schema: XmlParsingDivinerConfigSchema },
      })
      const observation = await witness.observe([{ schema: ApiCallSchema, uri }])
      expect(observation[0].schema).toBe(ApiCallResultSchema)
      expect(isApiCallErrorResult(observation[0].schema)).toBe(false)
      const xml = Buffer.from((observation[0] as unknown as { data: string }).data).toString('utf8')
      const input = { data: xml, schema: PayloadSchema }
      const result = await diviner.divine([input])
      expect(result[0].schema).toBe('network.xyo.xml')
    })
  })
})
