import { MemoryArchivist } from '@xyo-network/archivist-memory'

describe('Archivist', () => {
  it('insert payload', async () => {
    const archivist = await MemoryArchivist.create()
    const payload = { salt: '1', schema: 'network.xyo.id' }
    await archivist.insert([payload])
  })
  it('insert payloads', async () => {
    const archivist = await MemoryArchivist.create()
    const payloads = [
      { data: '1', schema: 'network.xyo.id' },
      { data: '2', schema: 'network.xyo.id' },
    ]
    await archivist.insert(payloads)
  })
})
