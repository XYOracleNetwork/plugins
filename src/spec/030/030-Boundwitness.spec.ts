import { Account } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'

describe('BoundWitness', () => {
  it('create boundwitness', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).build()
    console.log(boundWitness)
  })
  it('create boundwitness with signer', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const account = Account.randomSync()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
    console.log(boundWitness)
  })
  it('create boundwitness with multiple signers', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const accountA = Account.randomSync()
    const accountB = Account.randomSync()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signers([accountA, accountB]).build()
    console.log(boundWitness)
  })
})
