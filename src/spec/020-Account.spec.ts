import { Account } from '@xyo-network/account'
import { Mnemonic } from 'ethers'

describe('Account', () => {
  it('create random account', () => {
    const account = Account.randomSync()
    account.address
  })
  it('create reusable account', async () => {
    const mnemonic = Mnemonic.fromPhrase('inhale setup middle assault install bulb language acoustic argue allow kiss peanut march friend finish')
    const account = await Account.fromMnemonic(mnemonic)
    account.address
  })
})
