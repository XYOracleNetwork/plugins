import { PayloadHasher } from '@xyo-network/hash'

describe('Payload', () => {
  describe('create', () => {
    it('simple ', () => {
      const payload = { schema: 'network.xyo.payload' }
      console.log(payload)
    })
    it('of schema', () => {
      const payload = { salt: '1', schema: 'network.xyo.id' }
      console.log(payload)
    })
  })
  describe('hash', () => {
    it('hash a payload', () => {
      const payload = { salt: '1', schema: 'network.xyo.id' }
      const hash = PayloadHasher.hashSync(payload)
      console.log(hash)
    })
    it('hash a async (async)', async () => {
      const payload = { salt: '1', schema: 'network.xyo.id' }
      const hash = await PayloadHasher.hashAsync(payload)
      console.log(hash)
    })
  })
})
