import '@xylabs/vitest-extended'

import { ImageThumbnail, ImageThumbnailSchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { ModuleError, ModuleErrorSchema } from '@xyo-network/payload-model'
import { UrlPayload, UrlSchema } from '@xyo-network/url-payload-plugin'
import hasbin from 'hasbin'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { ImageThumbnailWitness } from '../Witness.ts'

const testIfHasBin = (bin: string) => (hasbin.sync(bin) ? it : it.skip)

/**
 * @group thumbnail
 */

describe('ImageThumbnailWitness', () => {
  let witness: ImageThumbnailWitness
  beforeAll(async () => {
    witness = await ImageThumbnailWitness.create({ account: 'random' })
  })
  testIfHasBin('magick')('IPFS [jpeg]', async () => {
    const ipfsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'ipfs://ipfs/QmewywDQGqz9WuWfT11ueSR3Mu86MejfD64v3KtFRzGP2G/image.jpeg',
    }
    const result = (await witness.observe([ipfsPayload])) as (ImageThumbnail | ModuleError)[]
    expect(result.length).toBe(1)
    const thumb = result[0] as ImageThumbnail
    expect(thumb.url?.length).toBeLessThan(64_000)
    const error = result[0] as ModuleError
    if (result[0].schema === ModuleErrorSchema) {
      console.log(`Error: ${error.message}`)
    }
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  })
  testIfHasBin('magick')('IPFS [png]', async () => {
    const ipfsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'ipfs://bafybeie3vrrqcq7iugzmsdsdxscvmvqnfkqkk7if2ywxu5h436wf72usga/470.png',
    }
    const result = (await witness.observe([ipfsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    const thumb = result[0] as ImageThumbnail
    expect(thumb.url?.length).toBeLessThan(64_000)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  })
  testIfHasBin('magick')('IPFS [bad (ipfs.io)]', async () => {
    const ipfsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://ipfs.io/ipfs/QmTkxZExjY97XSCTGoqGNxgYUE4kDakMykjbL1NVnH9xE9',
    }
    const result = (await witness.observe([ipfsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    console.log(`result: ${JSON.stringify(result, null, 2)}`)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  })
})
