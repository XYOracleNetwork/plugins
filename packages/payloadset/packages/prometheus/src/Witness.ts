import type { Server } from 'node:http'
import { createServer } from 'node:http'

import { exists } from '@xylabs/sdk-js'
import { AbstractWitness } from '@xyo-network/abstract-witness'
import type { AnyConfigSchema } from '@xyo-network/module-model'
import { creatableModule } from '@xyo-network/module-model'
import {
  asSchema, type Payload, type Schema,
} from '@xyo-network/payload-model'
import type { WitnessConfig, WitnessParams } from '@xyo-network/witness-model'
import { collectDefaultMetrics, Registry } from 'prom-client'

import type { PrometheusMetricValuePayload } from './Payload.ts'
import { PrometheusMetricValueSchema } from './Schema.ts'

export type PrometheusNodeWitnessConfigSchema = typeof PrometheusNodeWitnessConfigSchema
export const PrometheusNodeWitnessConfigSchema = asSchema('network.xyo.prometheus.node.witness.config', true)

export type PrometheusNodeWitnessConfig = WitnessConfig<{
  port?: number
  schema: PrometheusNodeWitnessConfigSchema
}>

export type PrometheusNodeWitnessParams = WitnessParams<AnyConfigSchema<PrometheusNodeWitnessConfig>>

creatableModule()
export class PrometheusNodeWitness<TParams extends PrometheusNodeWitnessParams = PrometheusNodeWitnessParams> extends AbstractWitness<TParams> {
  static override readonly configSchemas: Schema[] = [...super.configSchemas, PrometheusNodeWitnessConfigSchema]
  static override readonly defaultConfigSchema: Schema = PrometheusNodeWitnessConfigSchema
  protected _registry = new Registry()
  protected server?: Server

  get registry(): Registry {
    return this._registry
  }

  protected override async observeHandler(_payloads?: Partial<Payload>[]): Promise<Payload[]> {
    return await this.generateMetricValues()
  }

  protected override async startHandler() {
    collectDefaultMetrics({ register: this._registry })
    if (this.config.port) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.server = createServer(async (_request, response) => {
        response.writeHead(200)

        response.end(await this._registry.metrics())
      })
      this.server.listen(this.config.port)
    }
    return await super.startHandler()
  }

  protected override async stopHandler(): Promise<void> {
    this.server?.close()
    await super.stopHandler()
  }

  private async generateMetricValues(): Promise<PrometheusMetricValuePayload[]> {
    return (await this._registry.getMetricsAsJSON()).map((metric) => {
      const values = metric.values
      if (values) {
        return {
          aggregator: metric.aggregator, name: metric.name, schema: PrometheusMetricValueSchema, type: metric.type, values,
        }
      }
    }).filter(exists)
  }
}
