import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { LocationHeadingPayload, LocationPayload } from '@xyo-network/location-payload-plugin'
import { LocationHeadingSchema, LocationSchema } from '@xyo-network/location-payload-plugin'
import type { Payload, Schema } from '@xyo-network/payload-model'

import type { CurrentLocationWitnessParams } from './Config.ts'
import { CurrentLocationWitnessConfigSchema } from './Config.ts'

export class CurrentLocationWitness<TParams extends CurrentLocationWitnessParams = CurrentLocationWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, CurrentLocationWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = CurrentLocationWitnessConfigSchema

  get geolocation(): Geolocation {
    return assertEx(this.params.geolocation, () => 'No geolocation provided')
  }

  getCurrentPosition() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      this.geolocation?.getCurrentPosition(
        (position: GeolocationPosition) => {
          resolve(position)
        },
        (error: GeolocationPositionError) => {
          reject(error)
        },
      )
    })
  }

  protected override async observeHandler(): Promise<Payload[]> {
    const location = await this.getCurrentPosition()
    const locationPayload: LocationPayload = {
      altitude: location.coords.altitude ?? undefined,
      altitudeAccuracy: location.coords.altitudeAccuracy ?? undefined,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      schema: LocationSchema,
    }
    const heading: LocationHeadingPayload[]
      = location.coords.heading
        ? [
            {
              heading: location.coords.heading ?? undefined,
              schema: LocationHeadingSchema,
              speed: location.coords.speed ?? undefined,
            },
          ]
        : []
    return [locationPayload, ...heading]
  }
}
