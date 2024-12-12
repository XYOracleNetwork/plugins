import type { PayloadDivinerPredicate } from '@xyo-network/diviner-payload-model'
import type { Payload } from '@xyo-network/payload-model'
import { isPayloadOfSchemaType } from '@xyo-network/payload-model'

import { ImageThumbnailDivinerSchema } from './Schema.ts'

export type ImageThumbnailDivinerQuerySchema = `${ImageThumbnailDivinerSchema}.query`
export const ImageThumbnailDivinerQuerySchema: ImageThumbnailDivinerQuerySchema = `${ImageThumbnailDivinerSchema}.query`

export type ImageThumbnailDivinerQuery = Pick<PayloadDivinerPredicate, 'limit' | 'order'> &
  Payload<{ status?: number; success?: boolean; url: string }, ImageThumbnailDivinerQuerySchema>

export const isImageThumbnailDivinerQuery = isPayloadOfSchemaType<ImageThumbnailDivinerQuery>(ImageThumbnailDivinerQuerySchema)
