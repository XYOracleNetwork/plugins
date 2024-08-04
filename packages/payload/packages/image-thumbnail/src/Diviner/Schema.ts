import { ImageThumbnailSchema } from '../Schema.ts'

export const ImageThumbnailDivinerSchema = `${ImageThumbnailSchema}.diviner` as const
export type ImageThumbnailDivinerSchema = typeof ImageThumbnailDivinerSchema
