import { Payload, PayloadValidationFunction } from '@xyo-network/payload-model'
import { DomainFields } from '@xyo-network/xns-record-payload-plugins'

export const getDomainReservedStringsValidator = (
  reservedStrings: string[],
): PayloadValidationFunction<Payload<DomainFields>> => {
  return (payload: Payload<DomainFields>) => {
    const { domain } = payload
    // Check if in one of the reserved name lists
    if (reservedStrings.includes(domain)) {
      console.log('Reserved name')
      return false
    }
    return true
  }
}

export const getDomainReservedFragmentsValidator = (
  reservedFragments: string[],
): PayloadValidationFunction<Payload<DomainFields>> => {
  return (payload: Payload<DomainFields>) => {
    const { domain } = payload
    // Check if any of our fragments are in the name
    for (const reserved of reservedFragments) {
      if (domain.includes(reserved)) {
        console.log('Reserved name fragment')
        return false
      }
    }
    return true
  }
}

export const getDomainReservedNamesValidator = (reservedNames: string[]): PayloadValidationFunction<Payload<DomainFields>> => {
  return (payload: Payload<DomainFields>) => {
    const { domain } = payload
    // Check if any of our fragments are in the name
    for (const reserved of reservedNames) {
      const parts = reserved.split(' ')
      if (domain === [parts[1], parts[0]].join('') || domain === [parts[0], parts[1]].join('')) {
        console.log('Reserved name')
        return false
      }
    }
    return true
  }
}
