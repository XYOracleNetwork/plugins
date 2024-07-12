import { ImageThumbnailSchema } from '../Schema.js'

export const ImageThumbnailDivinerSchema = `${ImageThumbnailSchema}.diviner` as const
export type ImageThumbnailDivinerSchema = typeof ImageThumbnailDivinerSchema
