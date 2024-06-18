import { DomainLeaseEstimateDivinerValidationErrorDetailsSchema } from '../Schema'
import { DomainLeaseEstimateDivinerValidationErrorDetails, ErrorDetailsDictionary } from './Payload'

// export type DomainLeaseEstimateDivinerErrorDetailsDictionaryErrorCode = keyof typeof DomainLeaseEstimateDivinerErrorDetailsDictionary
export type DomainLeaseEstimateDivinerErrorDetailsDictionaryErrorCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export const DomainLeaseEstimateDivinerErrorDetailsDictionary: Readonly<
  Readonly<Record<DomainLeaseEstimateDivinerErrorDetailsDictionaryErrorCode, DomainLeaseEstimateDivinerValidationErrorDetails>> &
    ErrorDetailsDictionary
> = {
  0: { code: '0', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Success' },
  1: { code: '1', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Invalid casing' },
  2: { code: '2', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Invalid coin signature' },
  3: { code: '3', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Invalid length' },
  4: { code: '4', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Invalid name' },
  5: { code: '5', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Reserved fragment' },
  6: { code: '6', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Reserved name' },
  7: { code: '7', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Reserved string' },
  8: { code: '8', schema: DomainLeaseEstimateDivinerValidationErrorDetailsSchema, title: 'Invalid TLD' },
} as const
