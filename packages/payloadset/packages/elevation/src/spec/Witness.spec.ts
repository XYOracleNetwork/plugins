import '@xylabs/vitest-extended'

import { existsSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import type { ElevationPayload } from '@xyo-network/elevation-payload-plugin'
import { LocationSchema } from '@xyo-network/location-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { Quadkey } from '@xyo-network/quadkey'
import {
  describe, expect, test,
} from 'vitest'

import type { ElevationWitnessConfig } from '../Witness.ts'
import { ElevationWitness, ElevationWitnessConfigSchema } from '../Witness.ts'

const locations = [
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: 32.7157, lng: -117.1611 }, 16)?.base16String), schema: LocationSchema }, // San Diego
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: 39.7392, lng: -104.9903 }, 16)?.base16String), schema: LocationSchema }, // Denver
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: 41.8781, lng: -87.6298 }, 16)?.base16String), schema: LocationSchema }, // Chicago
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: -12.0464, lng: -77.0428 }, 16)?.base16String), schema: LocationSchema }, // Lima
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: 39.9042, lng: 116.4074 }, 16)?.base16String), schema: LocationSchema }, // Beijing
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: -33.8688, lng: 151.2093 }, 16)?.base16String), schema: LocationSchema }, // Sydney
  { quadkey: assertEx(Quadkey.fromLngLat({ lat: 47.3769, lng: 8.5417 }, 16)?.base16String), schema: LocationSchema }, // Zurich
]

const testDataDir = Path.join(__dirname, '..', '.testdata')
const northEast = Path.join(testDataDir, 'SRTM_NE_250m.tif')
const southEast = Path.join(testDataDir, 'SRTM_SE_250m.tif')
const west = Path.join(testDataDir, 'SRTM_W_250m.tif')
const config: ElevationWitnessConfig = {
  files: {
    northEast, southEast, west,
  },
  schema: ElevationWitnessConfigSchema,
}

describe('ElevationWitness', () => {
  const hasTestData = existsSync(testDataDir)
  test.skipIf(!hasTestData)('Witnessing via Observe', async () => {
    const witness = await ElevationWitness.create({ config })
    const result = (await witness.observe(locations)) as ElevationPayload[]
    await validateResult(result)
  })

  test.skipIf(!hasTestData)('Witnessing via Config', async () => {
    const witness = await ElevationWitness.create({ config: { ...config, locations } })
    const result = (await witness.observe()) as ElevationPayload[]
    await validateResult(result)
  })
})

const validateResult = async (result: ElevationPayload[]) => {
  expect(result[0].elevation).toBeDefined()
  expect(result[1].elevation).toBeDefined()
  expect(result[2].elevation).toBeDefined()
  expect(result[0].elevation === result[1].elevation).toBe(false)
  expect(result[0].elevation === result[2].elevation).toBe(false)
  expect(result[1].elevation === result[2].elevation).toBe(false)
  expect(await PayloadWrapper.wrap(result[0]).getValid()).toBe(true)
  expect(await PayloadWrapper.wrap(result[1]).getValid()).toBe(true)
  expect(await PayloadWrapper.wrap(result[2]).getValid()).toBe(true)
}
