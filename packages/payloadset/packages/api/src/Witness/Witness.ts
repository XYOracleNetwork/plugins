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
  ApiCall,
  ApiCallBase64Result,
  ApiCallErrorResult,
  ApiCallJsonResult,
  ApiCallJsonResultType,
  ApiCallResult,
  ApiCallXmlResult,
  MimeTypes,
} from '../Payload/index.ts'
import {
  ApiCallResultSchema,
  ApiCallSchema,
  asApiUriCall,
  asApiUriTemplateCall,
} from '../Payload/index.ts'
import { asApiUriCallWitnessConfig, asApiUriTemplateCallWitnessConfig } from './Config.ts'
import type { ApiCallWitnessParams } from './Params.ts'
import { ApiCallWitnessConfigSchema } from './Schema.ts'

export class ApiCallWitness<TParams extends ApiCallWitnessParams = ApiCallWitnessParams> extends AbstractWitness<TParams, ApiCall, ApiCallResult> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, ApiCallWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = ApiCallWitnessConfigSchema

  get accept(): MimeTypes {
    return this.config.accept ?? 'application/json'
  }

  get ipfsGateway() {
    return this.params.ipfsGateway
  }

  get timeout() {
    return this.config.timeout
  }

  getFullUri(call?: ApiCall): string {
    const { uri: callUri } = asApiUriCall(call) ?? {}
    const {
      uriTemplate: callUriTemplate, params: callParams, queries: callQueries,
    } = asApiUriTemplateCall(call) ?? {}
    const { uri: configUri } = asApiUriCallWitnessConfig(this.config) ?? {}
    const {
      uriTemplate: configUriTemplate, params: configParams, queries: configQueries,
    } = asApiUriTemplateCallWitnessConfig(this.config) ?? {}

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

  protected override async observeHandler(inPayloads: ApiCall[] = []): Promise<ApiCallResult[]> {
    await this.started('throw')
    try {
      const observations = await Promise.all(
        inPayloads.filter(isPayloadOfSchemaType(ApiCallSchema)).map(async (call) => {
          const { verb: callVerb } = call
          const { verb: configVerb } = this.config
          const verb = callVerb ?? configVerb ?? 'get'
          const uri = this.getFullUri(call)

          const validatedUri = assertEx(checkIpfsUrl(uri, this.ipfsGateway), () => 'Invalid URI')

          if (verb === 'get') {
            return this.httpGet(validatedUri, (await PayloadBuilder.build(call)).$hash)
          }

          const observation: ApiCallResult = {
            call: await PayloadHasher.hash(call),
            schema: ApiCallResultSchema,
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
  private async httpGet(url: string, call: Hash, headers?: Record<string, string | undefined>): Promise<ApiCallResult> {
    const result: ApiCallResult = {
      call,
      schema: ApiCallResultSchema,
    }
    try {
      switch (this.accept) {
        case 'application/json': {
          const axios = new AxiosJson({ headers: { ...this.getHeaders(headers), Accept: 'application/json' }, timeout: this.timeout })
          const response = await axios.get<ApiCallJsonResultType>(url)
          if (response.status >= 200 && response.status < 300) {
            const jsonResult = result as ApiCallJsonResult
            jsonResult.data = response.data
            jsonResult.contentType = 'application/json'
          } else {
            const errorResult = result as ApiCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
        case 'application/xml':
        case 'text/xml': {
          const axios = new Axios({
            headers: { ...this.getHeaders(headers), Accept: this.accept },
            responseType: 'arraybuffer',
            timeout: this.timeout,
          })
          const response = await axios.get(url)
          if (response.status >= 200 && response.status < 300) {
            const xmlResult = result as ApiCallXmlResult
            xmlResult.data = Buffer.from(response.data, 'binary').toString('utf8')
            xmlResult.contentType = response.headers['content-type']?.toString() ?? 'application/xml'
          } else {
            const errorResult = result as ApiCallErrorResult
            errorResult.http = { status: response.status }
          }
          break
        }
        default: {
          const axios = new Axios({
            headers: this.params.headers, responseType: 'arraybuffer', timeout: this.timeout,
          })
          const response = await axios.get(url)
          if (response.status >= 200 && response.status < 300) {
            const jsonResult = result as ApiCallBase64Result
            jsonResult.data = fromByteArray(Buffer.from(response.data, 'binary'))
            jsonResult.contentType = response.headers['content-type']?.toString() ?? 'application/octet-stream'
          } else {
            const errorResult = result as ApiCallErrorResult
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
