/* eslint-disable sonarjs/assertions-in-tests */
import '@xylabs/vitest-extended'

import { HDWallet } from '@xyo-network/wallet'
import { describe, it } from 'vitest'

describe('Wallet', () => {
  describe('create', () => {
    it('random', async () => {
      const wallet = await HDWallet.random()
      console.log(wallet.address)
    })
    it('reusable', async () => {
      const seedPhrase = 'inhale setup middle assault install bulb language acoustic argue allow kiss peanut march friend finish'
      const wallet = await HDWallet.fromPhrase(seedPhrase)
      console.log(wallet.address)
    })
  })
  describe('create child', () => {
    it('create child', async () => {
      const wallet = await HDWallet.random()
      console.log(wallet.address)
      const childAccount = await wallet.derivePath("0'/0/0")
      console.log(childAccount.address)
    })
  })
})
