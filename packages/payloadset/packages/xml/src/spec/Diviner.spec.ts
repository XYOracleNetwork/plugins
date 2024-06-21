import { ApiCallResultSchema, ApiCallSchema, ApiCallWitness, ApiCallWitnessConfigSchema, isApiCallErrorResult } from '@xyo-network/api-call-witness'

describe('XmlParsingDiviner', () => {
  const uri = 'https://medium.com/feed/xyonetwork'
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await ApiCallWitness.create({
        account: 'random',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: { accept: 'text/xml' as any, schema: ApiCallWitnessConfigSchema },
      })
      const observation = await witness.observe([{ schema: ApiCallSchema, uri }])
      expect(observation[0].schema).toBe(ApiCallResultSchema)
      expect(isApiCallErrorResult(observation[0].schema)).toBe(false)
      const xml = Buffer.from((observation[0] as unknown as { data: string }).data).toString('utf8')
    })
  })
})
