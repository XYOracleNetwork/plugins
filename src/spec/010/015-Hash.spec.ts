import { PayloadHasher } from '@xyo-network/hash'

describe('PayloadHasher', () => {
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
