import { asSchema } from '@xyo-network/payload-model'

import { ImageThumbnailSchema } from '../Schema.ts'

export const ImageThumbnailDivinerSchema = asSchema(`${ImageThumbnailSchema}.diviner`, true)
export type ImageThumbnailDivinerSchema = typeof ImageThumbnailDivinerSchema
