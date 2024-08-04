import { AbstractWitness } from '@xyo-network/abstract-witness'
import { AnyConfigSchema } from '@xyo-network/module-model'
import { defaultSystemInfoConfig, NodeSystemInfoSchema } from '@xyo-network/node-system-info-payload-plugin'
import { Payload, Schema } from '@xyo-network/payload-model'
import { WitnessModule, WitnessParams } from '@xyo-network/witness-model'
import { get } from 'systeminformation'

import { NodeSystemInfoWitnessConfig, NodeSystemInfoWitnessConfigSchema } from './Config.ts'

export type NodeSystemInfoWitnessParams = WitnessParams<AnyConfigSchema<NodeSystemInfoWitnessConfig>>

export class NodeSystemInfoWitness<TParams extends NodeSystemInfoWitnessParams = NodeSystemInfoWitnessParams>
  extends AbstractWitness<TParams>
  implements WitnessModule {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, NodeSystemInfoWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = NodeSystemInfoWitnessConfigSchema

  protected override async observeHandler(payloads?: Payload[]) {
    const node = await get(this.config?.nodeValues ?? defaultSystemInfoConfig())
    return [{ ...node, ...payloads?.[0], schema: NodeSystemInfoSchema }]
  }
}
