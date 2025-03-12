import type { Payload } from '@xyo-network/payload-model'
import type { Aggregator, MetricType } from 'prom-client'

import type { PrometheusMetricValueSchema } from './Schema.ts'

export type PrometheusMetricValuePayload = Payload<
  {
    aggregator: Aggregator
    name: string
    type: MetricType
    values: (number | string | object)[]
  },
  PrometheusMetricValueSchema
>
