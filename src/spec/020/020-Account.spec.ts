import '@xylabs/vitest-extended'

import { Account } from '@xyo-network/sdk-js'
import { describe, it } from 'vitest'

describe('Account', () => {
  it('create random', async () => {
    const account = await Account.random()
    console.log(account.address)
  })
  it('create random (async)', async () => {
    const account = await Account.create()
    console.log(account.address)
  })
})
