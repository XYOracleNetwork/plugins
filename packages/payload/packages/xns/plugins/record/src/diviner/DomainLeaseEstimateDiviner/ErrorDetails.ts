import { isPayloadOfSchemaType, isPayloadOfSchemaTypeWithMeta, isPayloadOfSchemaTypeWithSources, Payload } from '@xyo-network/payload-model'

import { DomainLeaseEstimateDivinerValidationErrorDetailsSchema } from './Schema'

export interface ErrorDetails<TErrorCode extends string | undefined = string | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // Index signature for any other additional properties
  /**
   * A string code indicating the error type.
   */
  code: TErrorCode
  /**
   * A human-readable explanation specific to this occurrence of the problem
   */
  detail?: string
  /**
   * A short, human-readable summary of the problem type.
   */
  title?: string
}

export type ErrorDetailsDictionary<T extends number = number> = {
  readonly [K in T]: ErrorDetails<`${K}`>
}

/**
 * A payment authorization token payload
 */
export type DomainLeaseEstimateDivinerValidationErrorDetails<TErrorCode extends string | undefined = string> = Payload<
  ErrorDetails<TErrorCode>,
  DomainLeaseEstimateDivinerValidationErrorDetailsSchema
>

/**
 * Identity function for DomainLeaseEstimateDivinerValidationErrorDetails payload
 */
export const isDomainLeaseEstimateDivinerValidationErrorDetails = isPayloadOfSchemaType<DomainLeaseEstimateDivinerValidationErrorDetails>(
  DomainLeaseEstimateDivinerValidationErrorDetailsSchema,
)

/**
 * Identity function for DomainLeaseEstimateDivinerValidationErrorDetails payload with sources
 */
export const isDomainLeaseEstimateDivinerValidationErrorDetailsWithSources =
  isPayloadOfSchemaTypeWithSources<DomainLeaseEstimateDivinerValidationErrorDetails>(DomainLeaseEstimateDivinerValidationErrorDetailsSchema)

/**
 * Identity function for DomainLeaseEstimateDivinerValidationErrorDetails payload with meta
 */
export const isDomainLeaseEstimateDivinerValidationErrorDetailsWithMeta =
  isPayloadOfSchemaTypeWithMeta<DomainLeaseEstimateDivinerValidationErrorDetails>(DomainLeaseEstimateDivinerValidationErrorDetailsSchema)
