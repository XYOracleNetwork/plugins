import { AbstractDiviner } from '@xyo-network/diviner-abstract'
import { DivinerModule, DivinerParams } from '@xyo-network/diviner-model'
import { ElevationPayload } from '@xyo-network/elevation-payload-plugin'
import { ElevationWitness, ElevationWitnessConfigSchema } from '@xyo-network/elevation-plugin'
import { LocationCertaintyHeuristic, LocationCertaintyPayload, LocationCertaintySchema } from '@xyo-network/location-certainty-payload-plugin'
import { LocationPayload, LocationSchema } from '@xyo-network/location-payload-plugin'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import { Payload, Schema } from '@xyo-network/payload-model'

import { LocationCertaintyDivinerConfig, LocationCertaintyDivinerConfigSchema } from './Config.js'

export type LocationCertaintyDivinerParams = DivinerParams<AnyConfigSchema<LocationCertaintyDivinerConfig>>

export class LocationCertaintyDiviner<TParam extends LocationCertaintyDivinerParams = LocationCertaintyDivinerParams>
  extends AbstractDiviner<TParam>
  implements DivinerModule
{
  static override readonly configSchemas: Schema[] = [...super.configSchemas, LocationCertaintyDivinerConfigSchema]
  static override readonly defaultConfigSchema: Schema = LocationCertaintyDivinerConfigSchema
  static override targetSchema = LocationCertaintySchema

  /* Given an array of numbers, find the min/max/mean */
  private static calcHeuristic(heuristic: (number | null)[]): LocationCertaintyHeuristic {
    return {
      // eslint-disable-next-line unicorn/no-array-reduce
      max: heuristic.reduce<number>((prev, value) => {
        return (
          value === null ? prev
          : value > prev ? value
          : prev
        )
      }, Number.NEGATIVE_INFINITY),
      mean: (() => {
        // eslint-disable-next-line unicorn/no-array-reduce
        const values = heuristic.reduce<number[]>(
          (prev, value) => {
            return value === null ? prev : [value + prev[0], prev[1] + 1]
          },
          [0, 0],
        )
        return values[0] / values[1]
      })(),
      // eslint-disable-next-line unicorn/no-array-reduce
      min: heuristic.reduce<number>((prev, value) => {
        return (
          value === null ? prev
          : value < prev ? value
          : prev
        )
      }, Number.POSITIVE_INFINITY),
    }
  }

  /* Given elevation and location payloads, generate heuristic arrays */
  private static locationsToHeuristics(elevations: ElevationPayload[], locations: LocationPayload[]) {
    // eslint-disable-next-line unicorn/no-array-reduce
    const heuristics = elevations.reduce<{ altitude: (number | null)[]; elevation: number[]; variance: (number | null)[] }>(
      (prev, elev, index) => {
        const elevation = elev.elevation
        if (elevation === undefined || elevation === null) {
          throw new Error('Invalid Elevation')
        }
        const altitude = locations[index].altitude
        prev.altitude.push(altitude ?? null)
        prev.elevation.push(elevation)
        prev.variance.push(altitude !== undefined && altitude !== null ? altitude - elevation : null)
        return prev
      },
      { altitude: [], elevation: [], variance: [] },
    )
    return heuristics
  }

  /** @description Given a set of locations, get the expected elevations (witness if needed), and return score/variance */
  protected override async divineHandler(payloads?: Payload[]): Promise<Payload[]> {
    const locations = payloads?.filter<LocationPayload>((payload): payload is LocationPayload => payload?.schema === LocationSchema)
    // If this is a query we support
    if (locations && locations?.length > 0) {
      const elevationWitness = await ElevationWitness.create({
        account: this.account,
        config: {
          locations,
          schema: ElevationWitnessConfigSchema,
        },
      })
      const elevations = (await elevationWitness.observe()) as ElevationPayload[]

      const heuristics = LocationCertaintyDiviner.locationsToHeuristics(elevations, locations)

      const result = await new PayloadBuilder<LocationCertaintyPayload>({ schema: LocationCertaintySchema })
        .fields({
          altitude: LocationCertaintyDiviner.calcHeuristic(heuristics.altitude),
          elevation: LocationCertaintyDiviner.calcHeuristic(heuristics.elevation),
          variance: LocationCertaintyDiviner.calcHeuristic(heuristics.variance),
        })
        .build()

      this.logger?.log('LocationCertaintyDiviner.Divine: Processed query')
      return [result]
    }
    return []
  }
}
