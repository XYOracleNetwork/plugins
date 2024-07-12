import { NodeSystemInfoPayload } from './Payload.js'
import { NodeSystemInfoSchema } from './Schema.js'

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
