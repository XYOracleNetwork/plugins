import { asSchema } from '@xyo-network/payload-model'

export type GeographicCoordinateSystemLocationSchema = typeof GeographicCoordinateSystemLocationSchema
export const GeographicCoordinateSystemLocationSchema = asSchema('network.xyo.location.gcs', true)

export type QuadkeyLocationSchema = typeof QuadkeyLocationSchema
export const QuadkeyLocationSchema = asSchema('network.xyo.location.quadkey', true)

export type LocationSchema = typeof LocationSchema
export const LocationSchema = asSchema('network.xyo.location', true)
