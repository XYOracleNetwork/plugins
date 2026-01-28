import { asSchema } from '@xyo-network/payload-model'

import { AdvertisingSchema } from '../../Schema.ts'

export const UtmSchema = asSchema(`${AdvertisingSchema}.utm`, true)
export type UtmSchema = typeof UtmSchema
