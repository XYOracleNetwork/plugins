import { Account } from '@xyo-network/account'

describe('Account', () => {
  it('create random', () => {
    const account = Account.randomSync()
    console.log(account.address)
  })
  it('create random (async)', async () => {
    const account = await Account.create()
    console.log(account.address)
  })
})
