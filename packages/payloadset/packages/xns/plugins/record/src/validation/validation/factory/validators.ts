/**
 * NOTE: These validators are private because they rely on private data that cannot be shared with clients.
 */

import type { PayloadValidationFunction, WithSources } from '@xyo-network/payload-model'
import type { DomainRegistration } from '@xyo-network/xns-record-payload-plugins'

export const getDomainRegistrationReservedStringsValidator = (
  reservedStrings: string[],
): PayloadValidationFunction<WithSources<DomainRegistration>> => {
  return (domainRegistration: WithSources<DomainRegistration>) => {
    const { domain } = domainRegistration
    // Check if in one of the reserved name lists
    if (reservedStrings.includes(domain)) {
      console.log('Reserved name')
      return false
    }
    return true
  }
}

export const getDomainRegistrationReservedFragmentsValidator = (
  reservedFragments: string[],
): PayloadValidationFunction<WithSources<DomainRegistration>> => {
  return (domainRegistration: WithSources<DomainRegistration>) => {
    const { domain } = domainRegistration
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

export const getDomainRegistrationReservedNamesValidator = (reservedNames: string[]): PayloadValidationFunction<WithSources<DomainRegistration>> => {
  return (domainRegistration: WithSources<DomainRegistration>) => {
    const { domain } = domainRegistration
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
