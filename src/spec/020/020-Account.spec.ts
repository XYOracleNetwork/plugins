import { Account } from '@xyo-network/account'

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
