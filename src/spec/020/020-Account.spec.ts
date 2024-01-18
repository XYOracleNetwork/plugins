import { Account } from '@xyo-network/account'
import { Mnemonic } from 'ethers'

describe('Account', () => {
  it('create random', () => {
    const account = Account.randomSync()
    console.log(account.address)
  })
  it('create random (async)', async () => {
    const account = await Account.create()
    console.log(account.address)
  })
  it('create reusable', async () => {
    const seedPhrase = 'inhale setup middle assault install bulb language acoustic argue allow kiss peanut march friend finish'
    const mnemonic = Mnemonic.fromPhrase(seedPhrase)
    const account = await Account.fromMnemonic(mnemonic)
    console.log(account.address)
  })
})
