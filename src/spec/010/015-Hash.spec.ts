import '@xylabs/vitest-extended'

import { ObjectHasher } from '@xyo-network/sdk-js'
import { describe, it } from 'vitest'

describe('PayloadHasher', () => {
  it('hash a async (async)', async () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    const hash = await ObjectHasher.hash(payload)
    console.log(hash)
  })
})
