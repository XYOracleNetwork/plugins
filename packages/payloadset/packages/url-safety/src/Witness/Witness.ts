import { axiosJsonConfig } from '@xylabs/axios'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { UrlPayload } from '@xyo-network/url-payload-plugin'
import { UrlSchema } from '@xyo-network/url-payload-plugin'
import type { UrlSafetyPayload, UrlSafetyThreatType } from '@xyo-network/url-safety-payload-plugin'
import { UrlSafetySchema } from '@xyo-network/url-safety-payload-plugin'
import { Axios } from 'axios'

import { UrlSafetyWitnessConfigSchema } from './Config.ts'
import type { UrlSafetyWitnessParams } from './Params.ts'

export type GoogleSafeBrowsingMatchSchema = 'com.google.safebrowsing.match'
export const GoogleSafeBrowsingMatchSchema: GoogleSafeBrowsingMatchSchema = 'com.google.safebrowsing.match'

export interface GoogleSafeBrowsingMatch {
  cacheDuration: string
  platformType: string
  threat: {
    url: string
  }
  threatEntryType: string
  threatType: string
}

export type GoogleSafeBrowsingMatchPayload = Payload<GoogleSafeBrowsingMatch, GoogleSafeBrowsingMatchSchema>

interface GoogleSafeBrowsingResult {
  matches?: GoogleSafeBrowsingMatch[]
}

const checkUrlSafety = async (
  urls: string[],
  config?: {
    endPoint?: string
    key?: string
  },
): Promise<GoogleSafeBrowsingMatchPayload[]> => {
  const axios = new Axios(axiosJsonConfig())
  const endPoint = config?.endPoint ?? 'https://safebrowsing.googleapis.com/v4/threatMatches:find'
  const key = config?.key
  const mutatedUrls = urls.map(url => url.replace('ipfs://', 'https://cloudflare-ipfs.com/'))
  if (mutatedUrls.length === 0) {
    return []
  }
  const postData = {
    client: {
      clientId: 'foreventory',
      clientVersion: '1.0',
    },
    threatInfo: {
      platformTypes: ['WINDOWS', 'LINUX', 'OSX'],
      threatEntries: mutatedUrls.map(url => ({ url })),
      threatEntryTypes: ['URL'],
      threatTypes: ['SOCIAL_ENGINEERING', 'POTENTIALLY_HARMFUL_APPLICATION', 'UNWANTED_SOFTWARE', 'THREAT_TYPE_UNSPECIFIED'],
    },
  }
  const result = (await axios.post<GoogleSafeBrowsingResult>(`${endPoint}?key=${key}`, postData, { headers: { referer: 'http://localhost:3000' } }))
    .data
  return result.matches?.map<GoogleSafeBrowsingMatchPayload>(match => ({ ...match, schema: GoogleSafeBrowsingMatchSchema })) ?? []
}

export class UrlSafetyWitness<TParams extends UrlSafetyWitnessParams = UrlSafetyWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, UrlSafetyWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = UrlSafetyWitnessConfigSchema

  get key() {
    return this.params.google?.safeBrowsing?.key
  }

  get urls() {
    return this.config?.urls
  }

  protected override async observeHandler(payloads: UrlPayload[] = []): Promise<UrlSafetyPayload[]> {
    const urls: string[]
      = this.urls
        ?? payloads
          .filter((p): p is UrlPayload => p.schema === UrlSchema)
          .map((p) => {
            return p.url
          })

    const matches = await checkUrlSafety(urls, { key: this.key })

    return urls.map((url) => {
      // eslint-disable-next-line unicorn/no-array-reduce
      const payload = matches.reduce<UrlSafetyPayload>(
        (prev, match) => {
          if (match.threat.url === url) {
            prev.threatTypes = prev.threatTypes ?? []
            if (!prev.threatTypes.includes(match.threatEntryType as UrlSafetyThreatType)) {
              prev.threatTypes.push(match.threatEntryType as UrlSafetyThreatType)
            }
          }
          return prev
        },
        { schema: UrlSafetySchema, url },
      )
      payload.threatTypes = payload.threatTypes?.toSorted()
      return payload
    })
  }
}
