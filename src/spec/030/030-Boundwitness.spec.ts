import '@xylabs/vitest-extended'

import { BoundWitnessBuilder } from '@xyo-network/boundwitness-builder'
import { Account, asSchema } from '@xyo-network/sdk-js'
import { describe, it } from 'vitest'

describe('BoundWitness', () => {
  it('create boundwitness', async () => {
    const payload = { salt: '1', schema: asSchema('network.xyo.id', true) }
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).build()
    console.log(boundWitness)
  })
  it('create boundwitness with signer', async () => {
    const payload = { salt: '1', schema: asSchema('network.xyo.id', true) }
    const account = await Account.random()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signer(account).build()
    console.log(boundWitness)
  })
  it('create boundwitness with multiple signers', async () => {
    const payload = { salt: '1', schema: asSchema('network.xyo.id', true) }
    const accountA = await Account.random()
    const accountB = await Account.random()
    const [boundWitness] = await new BoundWitnessBuilder().payload(payload).signers([accountA, accountB]).build()
    console.log(boundWitness)
  })
})
