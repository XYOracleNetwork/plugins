import { Account } from '@xyo-network/account'
import { Mnemonic } from 'ethers'

describe('Account', () => {
  it('create random account', () => {
    const account = Account.randomSync()
    console.log(account.address)
  })
  it('create random account (async)', async () => {
    const account = await Account.create()
    console.log(account.address)
  })
  it('create reusable account', async () => {
    const seedPhrase = 'inhale setup middle assault install bulb language acoustic argue allow kiss peanut march friend finish'
    const mnemonic = Mnemonic.fromPhrase(seedPhrase)
    const account = await Account.fromMnemonic(mnemonic)
    console.log(account.address)
  })
})
