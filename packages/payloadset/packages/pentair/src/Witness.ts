import { assertEx } from '@xylabs/assert'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { Payload } from '@xyo-network/payload-model'
import { PentairScreenlogicPayload, PentairScreenlogicSchema } from '@xyo-network/pentair-payload-plugin'
import { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'
import { FindUnits, SchedTypes, screenlogic } from 'node-screenlogic'

export type PentairScreenlogicWitnessConfigSchema = 'network.xyo.pentair.screenlogic.witness.config'
export const PentairScreenlogicWitnessConfigSchema: PentairScreenlogicWitnessConfigSchema = 'network.xyo.pentair.screenlogic.witness.config'

export type PentairScreenlogicWitnessConfig = WitnessConfig<{
  schema: PentairScreenlogicWitnessConfigSchema
}>

export type PentairScreenlogicWitnessParams = WitnessParams<AnyConfigSchema<PentairScreenlogicWitnessConfig>>

export class PentairScreenlogicWitness<
  TParams extends PentairScreenlogicWitnessParams = PentairScreenlogicWitnessParams,
> extends AbstractWitness<TParams> {
  static override configSchemas = [PentairScreenlogicWitnessConfigSchema]

  protected override async observeHandler(_payloads?: Partial<Payload>[]): Promise<Payload[]> {
    const finder = new FindUnits()
    const localUnit = assertEx((await finder.searchAsync()).shift(), 'No local screenlogic unit found')
    screenlogic.initUnit(localUnit)
    assertEx(await screenlogic.connectAsync(), 'Failed to connect to ScreenLogic')

    return [
      {
        chem: await screenlogic.chem.getChemicalDataAsync(),
        chlor: await screenlogic.chlor.getIntellichlorConfigAsync(),
        equipment: {
          circuitNames: await screenlogic.equipment.getAllCircuitNamesAsync(),
          config: await screenlogic.equipment.getEquipmentConfigurationAsync(),
          controllerConfig: await screenlogic.equipment.getControllerConfigAsync(),
          customNames: await screenlogic.equipment.getCustomNamesAsync(),
          state: await screenlogic.equipment.getEquipmentStateAsync(),
          systemTime: await screenlogic.equipment.getSystemTimeAsync(),
          weatherForecast: await screenlogic.equipment.getWeatherForecastAsync(),
        },
        schedule: {
          once: await screenlogic.schedule.getScheduleDataAsync(SchedTypes.RUNONCE),
          recurring: await screenlogic.schedule.getScheduleDataAsync(SchedTypes.RECURRING),
        },
        schema: PentairScreenlogicSchema,
        version: await screenlogic.getVersionAsync(),
      },
    ] as PentairScreenlogicPayload[]
  }
}
