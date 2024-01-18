import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { PayloadHasher } from '@xyo-network/hash'

describe('Archivist', () => {
  describe('insert', () => {
    it('payload', async () => {
      const archivist = await MemoryArchivist.create()
      const payload = { salt: '1', schema: 'network.xyo.id' }
      await archivist.insert([payload])
    })
    it('payloads', async () => {
      const archivist = await MemoryArchivist.create()
      const payloads = [
        { data: '1', schema: 'network.xyo.id' },
        { data: '2', schema: 'network.xyo.id' },
      ]
      await archivist.insert(payloads)
    })
  })
  describe('get', () => {
    it('get payload', async () => {
      const archivist = await MemoryArchivist.create()
      const payload = { salt: '1', schema: 'network.xyo.id' }
      const hash = await PayloadHasher.hashAsync(payload)
      await archivist.insert([payload])
      const result = await archivist.get([hash])
      console.log(result)
    })
  })
})
