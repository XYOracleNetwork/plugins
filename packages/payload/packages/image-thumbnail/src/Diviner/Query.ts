import type { PayloadDivinerPredicate } from '@xyo-network/diviner-payload-model'
import type { Payload } from '@xyo-network/payload-model'
import { asSchema, isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ImageThumbnailDivinerSchema } from './Schema.ts'

export type ImageThumbnailDivinerQuerySchema = typeof ImageThumbnailDivinerQuerySchema
export const ImageThumbnailDivinerQuerySchema = asSchema(`${ImageThumbnailDivinerSchema}.query`, true)

export type ImageThumbnailDivinerQuery = Pick<PayloadDivinerPredicate, 'limit' | 'order'>
  & Payload<{ status?: number; success?: boolean; url: string }, ImageThumbnailDivinerQuerySchema>

export const isImageThumbnailDivinerQuery = isPayloadOfSchemaType<ImageThumbnailDivinerQuery>(ImageThumbnailDivinerQuerySchema)
