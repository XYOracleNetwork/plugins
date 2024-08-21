import type { NodeSystemInfoPayload } from './Payload.ts'
import { NodeSystemInfoSchema } from './Schema.ts'

const defaultSystemInfoConfig = () => {
  return {
    audio: '*',
    battery: '*',
    bluetooth: '*',
    cpu: '*',
    diskLayout: '*',
    graphics: '*',
    mem: '*',
    networkInterfaces: '*',
    osInfo: '*',
    printer: '*',
    system: '*',
    usb: '*',
    wifiInterfaces: '*',
  }
}

const systemInfoNodeWitnessTemplate = (): NodeSystemInfoPayload => ({
  schema: NodeSystemInfoSchema,
})

export { defaultSystemInfoConfig, systemInfoNodeWitnessTemplate }
