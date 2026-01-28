import '@xylabs/vitest-extended'

import { Account } from '@xyo-network/account'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { asSchema } from '@xyo-network/payload'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { describe, it } from 'vitest'

describe('Archivist', () => {
  describe('insert', () => {
    it('payload', async () => {
      const archivist = await MemoryArchivist.create({ account: await Account.random() })
      const payload = { salt: '1', schema: asSchema('network.xyo.id', true) }
      await archivist.insert([payload])
    })
    it('payloads', async () => {
      const archivist = await MemoryArchivist.create({ account: await Account.random() })
      const payloads = [
        { data: '1', schema: asSchema('network.xyo.id', true) },
        { data: '2', schema: asSchema('network.xyo.id', true) },
      ]
      await archivist.insert(payloads)
    })
  })
  describe('get', () => {
    it('get payload', async () => {
      const archivist = await MemoryArchivist.create({ account: await Account.random() })
      const payload = { salt: '1', schema: asSchema('network.xyo.id', true) }
      const hash = await PayloadBuilder.dataHash(payload)
      await archivist.insert([payload])
      const result = await archivist.get([hash])
      console.log(result)
    })
  })
})
