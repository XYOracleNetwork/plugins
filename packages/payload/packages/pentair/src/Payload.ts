import type { Payload } from '@xyo-network/payload-model'
import type {
  SLChemData,
  SLCircuitNamesData,
  SLControllerConfigData,
  SLEquipmentConfigurationData,
  SLEquipmentStateData,
  SLGetCustomNamesData,
  SLIntellichlorData,
  SLPumpStatusData,
  SLScheduleData,
  SLSystemTimeData,
  SLVersionData,
  SLWeatherForecastData,
} from 'node-screenlogic'

import type { PentairScreenlogicSchema } from './Schema.ts'

export type PentairScreenlogicPayload = Payload<
  {
    chem: SLChemData
    chlor: SLIntellichlorData
    equipment?: {
      circuitNames?: SLCircuitNamesData
      config?: SLEquipmentConfigurationData
      controllerConfig?: SLControllerConfigData
      customNames?: SLGetCustomNamesData
      state?: SLEquipmentStateData
      systemTime?: SLSystemTimeData
      weatherForecast?: SLWeatherForecastData
    }
    pump?: {
      status: SLPumpStatusData[]
    }
    schedule?: {
      once?: SLScheduleData
      recurring?: SLScheduleData
    }
    version?: SLVersionData
  },
  PentairScreenlogicSchema
>
