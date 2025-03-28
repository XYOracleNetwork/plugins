import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { Payload, Schema } from '@xyo-network/payload-model'
import type { UrlPayload } from '@xyo-network/url-payload-plugin'
import { UrlSchema } from '@xyo-network/url-payload-plugin'

import { UrlWitnessConfigSchema } from './Config.ts'
import type { UrlWitnessParams } from './Params.ts'

export class UrlWitness<TParams extends UrlWitnessParams = UrlWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, UrlWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = UrlWitnessConfigSchema
  // eslint-disable-next-line sonarjs/public-static-readonly
  static hashUrl: ((url: string) => Promise<string>) | undefined = undefined

  get urls() {
    return this.config?.urls
  }

  protected override async observeHandler(payloads: Payload[] = []): Promise<Payload[]> {
    if (UrlWitness.hashUrl === undefined) {
      throw new Error('Set UrlWitness.hashUrl before using')
    }
    const urls: UrlPayload[]
      = this.urls?.map(url => ({ schema: UrlSchema, url }))
        ?? payloads
          .filter((p): p is UrlPayload => p.schema === UrlSchema)
          .map((p) => {
            return { schema: UrlSchema, url: p.url }
          })
    const hashed = await Promise.all(
      urls.map(async (url) => {
        // TODO: Different schema for hashed url
        return { ...url, hash: await assertEx(UrlWitness.hashUrl, () => 'Set UrlWitness.hashUrl before using')(url.url) }
      }),
    )
    // TODO: Handle partial success
    return hashed
  }
}
