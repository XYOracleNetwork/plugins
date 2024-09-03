import { isModuleName } from '@xyo-network/module-model'
import type { PayloadValidationFunction, WithSources } from '@xyo-network/payload-model'

import type { DomainRegistration } from '../../DomainRegistration/index.ts'

export const domainRegistrationCasingValidator: PayloadValidationFunction<WithSources<DomainRegistration>> = (
  domainRegistration: WithSources<DomainRegistration>,
) => {
  const { domain } = domainRegistration
  // Check if all lowercase
  if (domain.toLowerCase() !== domain) {
    console.log('name must be lowercase')
    return false
  }
  return true
}

export const domainRegistrationModuleNameValidator: PayloadValidationFunction<WithSources<DomainRegistration>> = (
  domainRegistration: WithSources<DomainRegistration>,
) => {
  const { domain } = domainRegistration

  // check if domain is a valid name
  if (!isModuleName(domain)) {
    console.log(`Domain is not a valid module name: ${domain}`)
    return false
  }

  return true
}

export const domainRegistrationTldValidator: PayloadValidationFunction<WithSources<DomainRegistration>> = (
  domainRegistration: WithSources<DomainRegistration>,
) => {
  const { tld } = domainRegistration
  // Check if all lowercase
  if (tld.toLowerCase() !== tld) {
    console.log('TLD must be lowercase')
    return false
  }
  // Check if supported TLDs
  if (tld !== 'xyo') {
    console.log('Only XYO TLD currently supported')
    return false
  }
  return true
}

export const getDomainRegistrationLengthValidator = (minNameLength: number): PayloadValidationFunction<WithSources<DomainRegistration>> => {
  return (domainRegistration: WithSources<DomainRegistration>) => {
    const { domain } = domainRegistration
    // Check if min length
    if (domain.length < minNameLength) {
      console.log(`name must be at least ${minNameLength} characters`)
      return false
    }
    return true
  }
}

export const getDomainRegistrationAllowedHyphensValidator = (
  options?: { end?: boolean; start?: boolean },
): PayloadValidationFunction<WithSources<DomainRegistration>> => {
  return (domainRegistration: WithSources<DomainRegistration>) => {
    const { domain } = domainRegistration
    const { start, end } = options ?? {}
    if (!start && domain.startsWith('-')) {
      console.log('name cannot start with hyphen')
      return false
    }
    if (!end && domain.endsWith('-')) {
      console.log('name cannot end with hyphen')
      return false
    }
    return true
  }
}