import '@xylabs/vitest-extended'

import type { ImageThumbnail } from '@xyo-network/image-thumbnail-payload-plugin'
import { ImageThumbnailSchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { PayloadBuilder, removeEmptyFields } from '@xyo-network/sdk-js'
import type { UrlPayload } from '@xyo-network/url-payload-plugin'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import hasbin from 'hasbin'
import {
  beforeAll,
  describe, expect, it,
} from 'vitest'

import { ImageThumbnailWitness } from '../Witness.ts'

const describeIfHasBin = (bin: string) => (hasbin.sync(bin) ? describe : describe.skip)

/**
 * @group thumbnail
 */

describeIfHasBin('magick')('ImageThumbnailWitness', () => {
  let witness: ImageThumbnailWitness
  beforeAll(async () => {
    witness = await ImageThumbnailWitness.create({ account: 'random' })
  })
  it('HTTPS [medium/avif]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://i.seadn.io/gae/sOGk14HmHMajXRrra4X7Y1ZWncAPyidZap5StDRFCtKHHNSiIUNMpa12v4wqmyp1lEe4CxSxpWgpfiIdh-b_Mn3fq9LDM68i9gof9w?w=500&auto=format',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0].url?.length).toBeLessThan(64_000)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
  it.skip('HTTPS [medium/png/unsafe]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://ethercb.com/image.png',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
    expect(result[0].url?.length).toBeLessThan(64_000)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
  it('HTTPS [medium/svg]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/AJ_Digital_Camera.svg',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0].url?.length).toBeLessThan(64_000)

    // do a second pass and make sure we get cached result
    const result2 = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result2.length).toBe(1)
    expect(result2[0].url?.length).toEqual(result[0].url?.length)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
  it('HTTPS [medium/ens]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,

      url: 'https://metadata.ens.domains/mainnet/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/ens.eth/image',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    console.log(`ENS-SourceHash: ${result[0].sourceHash}`)
    console.log(`ENS-Hash: ${await PayloadBuilder.hash(result[0])}`)
    console.log(`ENS-DataHash: ${await PayloadBuilder.dataHash(removeEmptyFields(result[0]))}`)
    console.log(`ENS-Result: ${JSON.stringify(result[0], null, 2)}`)
    expect(result.length).toBe(1)
    expect(result[0].url?.length).toBeLessThan(128_000)

    // do a second pass and make sure we get cached result
    const result2 = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result2.length).toBe(1)
    expect(result2[0].url?.length).toEqual(result[0].url?.length)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
  it('HTTPS [large/gif (animated)]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://lh3.googleusercontent.com/N3uFgyMt0xOew9YjD8GiOLQEbbQ2Y7WJOqoHdUdZZSljKrbuKNt6VGkAByzyPAI80y81tELH6tKatSZvFXKfcbBdm6GfCyZhFWxgOTw',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0].url?.length).toBeLessThan(64_000)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
  it('HTTPS [html/error]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://espn.com',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0]?.mime?.invalid).toBe(true)
  }, 20_000)
  it('HTTPS [dns/error]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://sdjkfsdljkfhdskfsd.com',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0]?.http?.code).toBe('ENOTFOUND')
  }, 20_000)
  it('HTTPS [other/error]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://profilesetting.in/mier/logo.gif',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    console.log(`HTTPS [other/error]: ${JSON.stringify(result)}`)
    expect(result[0]?.http?.code).toBe('EPROTO')
  }, 20_000)
  it.skip('HTTPS [medium/png]', async () => {
    const httpsPayload: UrlPayload = {
      schema: UrlSchema,
      url: 'https://usdclive.org/usdc.png',
    }
    const result = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result.length).toBe(1)
    expect(result[0].url?.length).toBeLessThan(64_000)

    // do a second pass and make sure we get cached result
    const result2 = (await witness.observe([httpsPayload])) as ImageThumbnail[]
    expect(result2.length).toBe(1)
    expect(result2[0].url?.length).toEqual(result[0].url?.length)
    expect(result[0].schema).toBe(ImageThumbnailSchema)
  }, 20_000)
})
