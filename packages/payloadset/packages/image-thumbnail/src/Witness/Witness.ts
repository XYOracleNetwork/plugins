/* eslint-disable max-statements */
import { Buffer } from 'node:buffer'
import { promises as dnsPromises } from 'node:dns'

import { exists } from '@xylabs/exists'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { ObjectHasher } from '@xyo-network/hash'
import { ImageThumbnail, ImageThumbnailSchema } from '@xyo-network/image-thumbnail-payload-plugin'
import { Schema } from '@xyo-network/payload-model'
import { UrlPayload, UrlSchema } from '@xyo-network/url-payload-plugin'
import { Semaphore } from 'async-mutex'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { fileTypeFromBuffer } from 'file-type'
import graphicsMagick from 'gm'
import hasbin from 'hasbin'
import { sha256 } from 'hash-wasm'
import shajs from 'sha.js'
import Url from 'url-parse'

import { ImageThumbnailEncoding, ImageThumbnailWitnessConfigSchema } from './Config.ts'
import { getVideoFrameAsImageFluent } from './ffmpeg/index.ts'
import {
  checkIpfsUrl, createDataUrl, resolveDynamicSvg,
} from './lib/index.ts'
import { ImageThumbnailWitnessParams } from './Params.ts'

// TODO: Break this into two Witnesses?

// setFfmpegPath(ffmpegPath)

const gm = graphicsMagick.subClass({ imageMagick: '7+' })

export interface ImageThumbnailWitnessError extends Error {
  name: 'ImageThumbnailWitnessError'
  url: string
}

export interface DnsError extends Error {
  code: string
}

export class ImageThumbnailWitness<TParams extends ImageThumbnailWitnessParams = ImageThumbnailWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, ImageThumbnailWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = ImageThumbnailWitnessConfigSchema

  private _semaphore = new Semaphore(this.maxAsyncProcesses)

  get encoding() {
    return this.config.encoding ?? 'PNG'
  }

  get height() {
    return this.config.height ?? 128
  }

  get ipfsGateway() {
    return this.config.ipfsGateway ?? '5d7b6582.beta.decentralnetworkservices.com'
  }

  get maxAsyncProcesses() {
    return this.config.maxAsyncProcesses ?? 4
  }

  get quality() {
    return this.config.quality ?? 50
  }

  get width() {
    return this.config.width ?? 128
  }

  private static async binaryToSha256(data: ArrayBufferLike) {
    const viewData = new Uint8Array(data)
    await ObjectHasher.wasmInitialized
    if (ObjectHasher.wasmSupport.canUseWasm) {
      try {
        return await sha256(viewData)
      } catch {
        ObjectHasher.wasmSupport.allowWasm = false
      }
    }

    return shajs('sha256').update(viewData).digest().toString()
  }

  private static bufferFromDataUrl(url: string): ArrayBufferLike | undefined {
    if (url.startsWith('data:image')) {
      const data = url.split(',')[1]
      if (data) {
        return Uint8Array.from(atob(data), c => c.codePointAt(0) ?? 0).buffer
      } else {
        const error: ImageThumbnailWitnessError = {
          message: 'Invalid data Url',
          name: 'ImageThumbnailWitnessError',
          url,
        }
        throw error
      }
    }
  }

  protected override async observeHandler(payloads: UrlPayload[] = []): Promise<ImageThumbnail[]> {
    if (!hasbin.sync('magick')) {
      throw new Error('ImageMagick is required for this witness')
    }
    const urlPayloads = payloads.filter(payload => payload.schema === UrlSchema)
    const process = async () => {
      return (await Promise.all(
        urlPayloads.map<Promise<ImageThumbnail>>(async ({ url }) => {
          let result: ImageThumbnail

          // if it is a data URL, return a Buffer
          const dataBuffer = ImageThumbnailWitness.bufferFromDataUrl(url)

          if (dataBuffer) {
            if (this.config.dataUrlPassthrough) {
              result = {
                schema: ImageThumbnailSchema,
                sourceHash: await ImageThumbnailWitness.binaryToSha256(dataBuffer),
                sourceUrl: url,
                url,
              }
            } else {
              let cookedDataBuffer = dataBuffer
              const urlParts = url.split(';')
              const [, contentType] = urlParts[0].split(':')
              if (contentType.startsWith('image/svg')) {
                const [encoding, byteString] = urlParts[1].split(',')
                if (encoding === 'base64') {
                  const newSvg = await resolveDynamicSvg(byteString)
                  const newSvgDataUrl = createDataUrl(Buffer.from(newSvg).buffer, contentType)
                  cookedDataBuffer = ImageThumbnailWitness.bufferFromDataUrl(newSvgDataUrl) ?? dataBuffer
                }
              }
              result = await this.processMedia(
                cookedDataBuffer,
                {
                  schema: ImageThumbnailSchema,
                  sourceUrl: url,
                },
                contentType,
              )
            }
          } else {
            // if it is ipfs, go through cloud flair
            const mutatedUrl = checkIpfsUrl(url, this.ipfsGateway)
            result = await this.fromHttp(mutatedUrl, url)
          }
          return result
        }),
      )).filter(exists)
    }
    return this.config.runExclusive ? await this._semaphore.runExclusive(() => process()) : process()
  }

  private async createThumbnailDataUrl(sourceBuffer: ArrayBufferLike, encoding?: ImageThumbnailEncoding) {
    const thumb = await new Promise<Buffer>((resolve, reject) => {
      gm(Buffer.from(sourceBuffer))
        .quality(this.quality)
        .resize(this.width, this.height)
        .flatten()
        .toBuffer(encoding ?? this.encoding, (error, buffer) => {
          if (error) {
            reject(error)
          } else {
            resolve(buffer)
          }
        })
    })
    return createDataUrl(thumb.buffer, 'image/png')
  }

  /**
   * Creates an image thumbnail from a video.
   * @param videoBuffer The input video buffer.
   * @returns An buffer containing an image thumbnail for the video.
   */
  private async createThumbnailFromVideo(videoBuffer: ArrayBufferLike) {
    const imageBuffer = await getVideoFrameAsImageFluent(videoBuffer)
    return this.createThumbnailDataUrl(imageBuffer.buffer)
  }

  // eslint-disable-next-line complexity
  private async fromHttp(url: string, sourceUrl?: string): Promise<ImageThumbnail> {
    let response: AxiosResponse
    let dnsResult: string[]
    try {
      const urlObj = new Url(url)
      dnsResult = await dnsPromises.resolve(urlObj.host)
    } catch (ex) {
      const error = ex as DnsError
      const result: ImageThumbnail = {
        http: { code: error.code },
        schema: ImageThumbnailSchema,
        sourceUrl: sourceUrl ?? url,
      }
      return result
    }
    try {
      response = await axios.get(url, { responseType: 'arraybuffer' })
    } catch (ex) {
      const axiosError = ex as AxiosError
      if (axiosError.isAxiosError) {
        // selectively pick fields from AxiosError
        const result: ImageThumbnail = {
          http: { ipAddress: dnsResult[0] },
          schema: ImageThumbnailSchema,
          sourceUrl: sourceUrl ?? url,
        }
        if (axiosError?.response?.status !== undefined) {
          result.http = result.http ?? {}
          result.http.status = axiosError?.response?.status
        }
        if (axiosError?.code !== undefined) {
          result.http = result.http ?? {}
          result.http.code = axiosError?.code
        }
        return result
      } else {
        throw ex
      }
    }

    const result: ImageThumbnail = {
      http: { status: response.status },
      schema: ImageThumbnailSchema,
      sourceUrl: sourceUrl ?? url,
    }

    if (response.status >= 200 && response.status < 300) {
      const contentType: string | undefined = response.headers['content-type']?.toString()
      const sourceBuffer = Buffer.from(response.data, 'binary').buffer

      return this.processMedia(sourceBuffer, result, contentType)
    }
    return result
  }

  private async processMedia(sourceBuffer: ArrayBufferLike, imageThumbnail: ImageThumbnail, contentType?: string): Promise<ImageThumbnail> {
    const [mediaType, fileType] = contentType?.split('/') ?? ['', '']
    imageThumbnail.mime = imageThumbnail.mime ?? {}
    imageThumbnail.mime.returned = mediaType

    try {
      imageThumbnail.mime.detected = await fileTypeFromBuffer(sourceBuffer as ArrayBuffer)
    } catch (ex) {
      const error = ex as Error
      this.logger?.error(`FileType error: ${error.message}`)
    }

    const processImage = async (encoding?: ImageThumbnailEncoding) => {
      imageThumbnail.sourceHash = await ImageThumbnailWitness.binaryToSha256(sourceBuffer)
      imageThumbnail.url = await this.createThumbnailDataUrl(sourceBuffer, encoding)
    }

    const processVideo = async () => {
      // Gracefully handle the case where ffmpeg is not installed.

      if (hasbin.sync('ffmpeg')) {
        imageThumbnail.sourceHash = await ImageThumbnailWitness.binaryToSha256(sourceBuffer)
        imageThumbnail.url = await this.createThumbnailFromVideo(sourceBuffer)
      } else {
        imageThumbnail.mime = imageThumbnail.mime ?? {}
        imageThumbnail.mime.invalid = true
      }
    }

    let encoding: ImageThumbnailEncoding = 'PNG'

    switch (fileType.toUpperCase()) {
      case 'GIF': {
        encoding = 'GIF'
        break
      }
      case 'JPG':
      case 'JPEG': {
        encoding = 'JPG'
        break
      }
    }

    switch (mediaType) {
      case 'image': {
        await processImage(encoding)
        imageThumbnail.mime.type = mediaType
        break
      }
      case 'video': {
        await processVideo()
        imageThumbnail.mime.type = mediaType
        break
      }
      default: {
        const [detectedMediaType] = imageThumbnail.mime.detected?.mime?.split('/') ?? ['', '']
        switch (detectedMediaType) {
          case 'image': {
            await processImage()
            imageThumbnail.mime.type = imageThumbnail.mime.detected?.mime
            break
          }
          case 'video': {
            await processVideo()
            imageThumbnail.mime.type = imageThumbnail.mime.detected?.mime
            break
          }
          default: {
            imageThumbnail.mime.invalid = true
            break
          }
        }
        break
      }
    }
    return imageThumbnail
  }
}
