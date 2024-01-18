import { Account } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'

describe('BoundWitness', () => {
  it('create boundwitness', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).build()
  })
  it('create boundwitness with signature', () => {
    const account = Account.randomSync()
    const payload = { salt: '1', schema: 'network.xyo.id' }
  })
})
