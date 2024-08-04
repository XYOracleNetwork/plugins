import { PayloadHasher } from '@xyo-network/hash'

describe('PayloadHasher', () => {
  it('hash a async (async)', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const hash = await PayloadHasher.hash(payload)
    console.log(hash)
  })
})
