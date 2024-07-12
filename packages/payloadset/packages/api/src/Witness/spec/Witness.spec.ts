import { ApiCallResultSchema, ApiCallSchema, isApiCallErrorResult } from '../../Payload'
import { ApiCallWitnessConfigSchema } from '../Schema.js'
import { ApiCallWitness } from '../Witness'

describe('CryptoWalletNftWitness', () => {
  const uri = 'https://cnn.com'
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await ApiCallWitness.create({
        account: 'random',
        config: { accept: 'application/json', schema: ApiCallWitnessConfigSchema },
      })
      const observation = await witness.observe([{ schema: ApiCallSchema, uri }])
      expect(observation[0].schema).toBe(ApiCallResultSchema)
      expect(isApiCallErrorResult(observation[0].schema)).toBe(false)
    })
  })
})
