import type { Payload } from '@xyo-network/payload-model'
import type { Parser } from 'bowser'

import type { BowserSystemInfoSchema } from './Schema.ts'

export type BowserSystemInfoPayload = Payload<{
  bowser?: Parser.ParsedResult
  schema: BowserSystemInfoSchema
}>
