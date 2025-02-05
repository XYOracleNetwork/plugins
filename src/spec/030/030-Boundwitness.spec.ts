/* eslint-disable sonarjs/assertions-in-tests */
import '@xylabs/vitest-extended'

import { Account } from '@xyo-network/account'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { describe, it } from 'vitest'

describe('BoundWitness', () => {
  it('create boundwitness', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).build()
    console.log(boundWitness)
  })
  it('create boundwitness with signer', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const account = await Account.random()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
    console.log(boundWitness)
  })
  it('create boundwitness with multiple signers', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const accountA = await Account.random()
    const accountB = await Account.random()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signers([accountA, accountB]).build()
    console.log(boundWitness)
  })
})
