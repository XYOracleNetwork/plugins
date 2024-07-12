import { createPayloadPlugin } from '@xyo-network/payload-plugin'

import { ImageThumbnail } from './Payload/index.js'
import { ImageThumbnailSchema } from './Schema.js'

export const ImageThumbnailPayloadPlugin = () =>
  createPayloadPlugin<ImageThumbnail>({
    schema: ImageThumbnailSchema,
  })
