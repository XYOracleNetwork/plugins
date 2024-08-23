/* eslint-disable max-statements */
import { assertEx } from '@xylabs/assert'
import { AxiosJson } from '@xylabs/axios'
import type { Hash } from '@xylabs/hex'
import { URL } from '@xylabs/url'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { PayloadHasher } from '@xyo-network/hash'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Schema } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'
import type { AxiosError } from 'axios'
import { Axios } from 'axios'
import { fromByteArray } from 'base64-js'
import fillTemplate from 'es6-dynamic-template'

import { checkIpfsUrl } from '../lib/index.ts'
import type {
  HttpCall,
  HttpCallBase64Result,
  HttpCallErrorResult,
  HttpCallJsonResult,
  HttpCallJsonResultType,
  HttpCallResult,
  HttpCallXmlResult,
  MimeTypes,
} from '../Payload/index.ts'
import {
  asHttpUriCall,
  asHttpUriTemplateCall,
  HttpCallResultSchema,
  HttpCallSchema,
} from '../Payload/index.ts'
import type { HttpCallHtmlResult } from '../Payload/types/index.ts'
import { asHttpUriCallWitnessConfig, asHttpUriTemplateCallWitnessConfig } from './Config.ts'
import type { HttpCallWitnessParams } from './Params.ts'
import { HttpCallWitnessConfigSchema } from './Schema.ts'

export class HttpCallWitness<TParams extends HttpCallWitnessParams = HttpCallWitnessParams> extends AbstractWitness<TParams, HttpCall, HttpCallResult> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, HttpCallWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = HttpCallWitnessConfigSchema

  get accept(): MimeTypes {
    return this.config.accept ?? 'application/json'
  }

  get ipfsGateway() {
    return this.params.ipfsGateway
  }

  get timeout() {
    return this.config.timeout
  }

  getFullUri(call?: HttpCall): string {
    const { uri: callUri } = asHttpUriCall(call) ?? {}
    const {
      uriTemplate: callUriTemplate, params: callParams, queries: callQueries,
    } = asHttpUriTemplateCall(call) ?? {}
    const { uri: configUri } = asHttpUriCallWitnessConfig(this.config) ?? {}
    const {
      uriTemplate: configUriTemplate, params: configParams, queries: configQueries,
    } = asHttpUriTemplateCallWitnessConfig(this.config) ?? {}

    const params = { ...configParams, ...callParams }

    let url: URL | undefined = undefined

    if (callUri) {
      url = new URL(callUri)
    } else if (callUriTemplate) {
      url = new URL(fillTemplate(callUriTemplate, params))
    } else if (configUri) {
      url = new URL(configUri)
    } else if (configUriTemplate) {
      url = new URL(fillTemplate(configUriTemplate, params))
    }

    if (url) {
      const queries = Object.entries({ ...configQueries, ...callQueries })
      queries.map(([key, value]) => url?.searchParams.set(key, value))
      return url.href
    }

    throw new Error('Unable to determine uri. No uri/uriTemplate specified in either the call or config.')
  }

  getHeaders(headers?: Record<string, string | undefined>): Record<string, string | undefined> {
    return {
      ...this.params.headers, ...this.config.headers, ...headers,
    }
  }

  protected override async observeHandler(inPayloads: HttpCall[] = []): Promise<HttpCallResult[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(HttpCallSchema)).map(async (call) => {
          const { verb: callVerb } = call
          const { verb: configVerb } = this.config
          const verb = callVerb ?? configVerb ?? 'get'
          const uri = this.getFullUri(call)

          const validatedUri = assertEx(checkIpfsUrl(uri, this.ipfsGateway), () => 'Invalid URI')

          if (verb === 'get') {
            return this.httpGet(validatedUri, (await PayloadBuilder.build(call)).$hash)
          }

          const observation: HttpCallResult = {
            call: await PayloadHasher.hash(call),
            schema: HttpCallResultSchema,
          }
          return observation
        }),
      )
      return observations
    } catch (ex) {
      const error = ex as Error
      console.error(`Error [${this.config.name}]: ${error.message}`)
      console.log(error.stack)
      throw error
    }
  }

  // eslint-disable-next-line complexity
  private async httpGet(url: string, call: Hash, headers?: Record<string, string | undefined>): Promise<HttpCallResult> {
    const result: HttpCallResult = {
      call,
      schema: HttpCallResultSchema,
    }
    try {
      switch (this.accept) {
        case 'application/json': {
          const axios = new AxiosJson({
            headers: { ...this.getHeaders(headers), Accept: 'application/json' }, timeout: this.timeout, decompress: true,
          })
          const response = await axios.get<HttpCallJsonResultType>(url)
          if (response.status >= 200 && response.status < 300) {
            const jsonResult = result as HttpCallJsonResult
            jsonResult.data = response.data
            jsonResult.contentType = 'application/json'
          } else {
            const errorResult = result as HttpCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
        case 'application/xml':
        case 'text/xml': {
          const axios = new Axios({
            headers: { ...this.getHeaders(headers), Accept: this.accept },
            responseType: 'arraybuffer',
            decompress: true,
            timeout: this.timeout,
          })
          const response = await axios.get(url)
          if (response.status >= 200 && response.status < 300) {
            const xmlResult = result as HttpCallXmlResult
            xmlResult.data = Buffer.from(response.data, 'binary').toString('utf8')
            xmlResult.contentType = response.headers['content-type']?.toString() ?? 'application/xml'
          } else {
            const errorResult = result as HttpCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
        case 'text/html':{
          const axios = new Axios({
            headers: { ...this.getHeaders(headers), Accept: this.accept },
            responseType: 'text',
            decompress: true,
            timeout: this.timeout,
          })
          const response = await axios.get(url)
          if (response.status >= 200 && response.status < 300) {
            const htmlResult = result as HttpCallHtmlResult
            htmlResult.data = response.data
            htmlResult.contentType = response.headers['content-type']?.toString() ?? 'text/html'
          } else {
            const errorResult = result as HttpCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
        default: {
          const axios = new Axios({
            headers: this.params.headers, responseType: 'arraybuffer', timeout: this.timeout, decompress: true,
          })
          const response = await axios.get(url)
          if (response.status >= 200 && response.status < 300) {
            const jsonResult = result as HttpCallBase64Result
            jsonResult.data = fromByteArray(Buffer.from(response.data, 'binary'))
            jsonResult.contentType = response.headers['content-type']?.toString() ?? 'application/octet-stream'
          } else {
            const errorResult = result as HttpCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
      }
    } catch (ex) {
      const axiosError = ex as AxiosError
      if (axiosError.isAxiosError) {
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
    return result
  }
}
