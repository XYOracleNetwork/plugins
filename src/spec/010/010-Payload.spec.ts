import '@xylabs/vitest-extended'

import { describe, it } from 'vitest'

describe('Payload', () => {
  it('create simple ', () => {
    const payload = { schema: 'network.xyo.payload' }
    console.log(payload)
  })
  it('create of schema', () => {
    const payload = { salt: '1', schema: 'network.xyo.id' }
    console.log(payload)
  })
})
