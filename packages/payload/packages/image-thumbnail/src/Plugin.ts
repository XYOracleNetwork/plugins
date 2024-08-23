import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import type { ImageThumbnail } from './Payload/index.ts'
import { ImageThumbnailSchema } from './Schema.ts'

export const ImageThumbnailPayloadPlugin = () =>
  createPayloadPlugin<ImageThumbnail>({ schema: ImageThumbnailSchema })
