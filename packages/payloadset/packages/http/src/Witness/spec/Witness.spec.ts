import {
  HttpCallResultSchema, HttpCallSchema, isHttpCallErrorResult,
} from '../../Payload/index.ts'
import { HttpCallWitnessConfigSchema } from '../Schema.ts'
import { HttpCallWitness } from '../Witness.ts'

describe('CryptoWalletNftWitness', () => {
  const uri = 'https://cnn.com'
  describe('observe', () => {
    it('get code from contract', async () => {
      const witness = await HttpCallWitness.create({
        account: 'random',
        config: { accept: 'text/html', schema: HttpCallWitnessConfigSchema },
      })
      const observation = await witness.observe([{ schema: HttpCallSchema, uri }])
      expect(observation[0].schema).toBe(HttpCallResultSchema)
      expect(isHttpCallErrorResult(observation[0].schema)).toBe(false)
    })
  })
})
