import { AbstractArchivist } from '@xyo-network/archivist-abstract'
import { MemoryArchivist } from '@xyo-network/archivist-memory'
import { LocationCertaintyPayload, LocationCertaintySchema } from '@xyo-network/location-certainty-payload-plugin'
import { LocationPayload, LocationSchema } from '@xyo-network/location-payload-plugin'
import { CompositeModuleResolver } from '@xyo-network/module-resolver'
import { WithMeta } from '@xyo-network/payload-model'

import { LocationCertaintyDivinerConfigSchema } from '../Config'
import { LocationCertaintyDiviner } from '../Diviner'

const sample1: LocationPayload[] = [
  {
    altitude: -5,
    latitude: 32.716_64,
    longitude: -117.120_33,
    schema: LocationSchema,
  },
  {
    altitude: -9,
    latitude: 32.7174,
    longitude: -117.116_74,
    schema: LocationSchema,
  },
  {
    altitude: -11,
    latitude: 32.717_88,
    longitude: -117.113_77,
    schema: LocationSchema,
  },
]

const sample2: LocationPayload[] = [
  {
    altitude: 50,
    latitude: 32.716_64,
    longitude: -117.120_33,
    schema: LocationSchema,
  },
  {
    altitude: 53,
    latitude: 32.7174,
    longitude: -117.116_74,
    schema: LocationSchema,
  },
  {
    altitude: 55,
    latitude: 32.717_88,
    longitude: -117.113_77,
    schema: LocationSchema,
  },
]

const sample3: LocationPayload[] = [
  {
    altitude: 151,
    latitude: 32.716_64,
    longitude: -117.120_33,
    schema: LocationSchema,
  },
  {
    altitude: 163,
    latitude: 32.7174,
    longitude: -117.116_74,
    schema: LocationSchema,
  },
  {
    altitude: 168,
    latitude: 32.717_88,
    longitude: -117.113_77,
    schema: LocationSchema,
  },
]

describe.skip('MongoDBLocationCertaintyDiviner', () => {
  let payloadsArchivist: AbstractArchivist
  let sut: LocationCertaintyDiviner
  beforeEach(async () => {
    payloadsArchivist = await MemoryArchivist.create()
    const params = {
      config: {
        schema: LocationCertaintyDivinerConfigSchema,
        targetSchema: LocationCertaintySchema,
      },
      resolver: new CompositeModuleResolver({ root: sut }).add(payloadsArchivist),
    }
    sut = (await LocationCertaintyDiviner.create(params)) as LocationCertaintyDiviner
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const noLocations: LocationPayload[] = []
        const noLocationsResult = await sut.divine(noLocations)
        expect(noLocationsResult).toBeArrayOfSize(0)
        const locations: LocationPayload[] = [
          { altitude: 5, quadkey: '0203', schema: LocationSchema },
          { altitude: 300, quadkey: '0102', schema: LocationSchema },
        ]
        const locationsResult = await sut.divine(locations)
        expect(locationsResult).toBeArrayOfSize(1)
        const actual = locationsResult[0] as WithMeta<LocationCertaintyPayload>
        expect(actual).toBeObject()
        expect(actual.schema).toBe(LocationCertaintySchema)

        const locationsResult1 = (await sut.divine(sample1)) as WithMeta<LocationCertaintyPayload>[]
        const locationsResult2 = (await sut.divine(sample2)) as WithMeta<LocationCertaintyPayload>[]
        const locationsResult3 = (await sut.divine(sample3)) as WithMeta<LocationCertaintyPayload>[]
        ;[locationsResult1, locationsResult2, locationsResult3].map(validateLocationResult)
      })
    })
  })
})

const validateLocationResult = (results: LocationCertaintyPayload[]) => {
  expect(results).toBeArrayOfSize(1)
  const [result] = results
  expect(result).toBeObject()
  expect(result.schema).toBe(LocationCertaintySchema)
  expect(result.altitude).toBeObject()
  expect(result.altitude.max).toBeNumber()
  expect(result.altitude.mean).toBeNumber()
  expect(result.altitude.min).toBeNumber()
  expect(result.elevation).toBeObject()
  expect(result.elevation.max).toBeNumber()
  expect(result.elevation.mean).toBeNumber()
  expect(result.elevation.min).toBeNumber()
  expect(result.variance).toBeObject()
  expect(result.variance.max).toBeNumber()
  expect(result.variance.mean).toBeNumber()
  expect(result.variance.min).toBeNumber()
}
