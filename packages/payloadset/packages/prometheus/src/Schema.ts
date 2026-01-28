import { asSchema } from '@xyo-network/payload-model'

export type PrometheusMetricValueSchema = typeof PrometheusMetricValueSchema
export const PrometheusMetricValueSchema = asSchema('network.xyo.prometheus.metric.value', true)
