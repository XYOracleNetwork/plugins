import { isModuleName } from '@xyo-network/module-model'
import type { PayloadValidationFunction, WithSources } from '@xyo-network/payload-model'
import type { Domain } from '@xyo-network/xns-record-payload-plugins'

export const domainRegistrationCasingValidator: PayloadValidationFunction<WithSources<Domain>> = (
  domainRegistration: WithSources<Domain>,
) => {
  const { domain } = domainRegistration
  // Check if all lowercase
  if (domain.toLowerCase() !== domain) {
    console.log('name must be lowercase')
    return false
  }
  return true
}

export const domainRegistrationModuleNameValidator: PayloadValidationFunction<WithSources<Domain>> = (
  domainRegistration: WithSources<Domain>,
) => {
  const { domain } = domainRegistration

  // check if domain is a valid name
  if (!isModuleName(domain)) {
    console.log(`Domain is not a valid module name: ${domain}`)
    return false
  }

  return true
}

export const domainRegistrationTldValidator: PayloadValidationFunction<WithSources<Domain>> = (
  domainRegistration: WithSources<Domain>,
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

export const getDomainRegistrationLengthValidator = (minNameLength = 3): PayloadValidationFunction<WithSources<Domain>> => {
  return (domainRegistration: WithSources<Domain>) => {
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
): PayloadValidationFunction<WithSources<Domain>> => {
  return (domainRegistration: WithSources<Domain>) => {
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

export const XnsNamePublicValidators = [
  domainRegistrationCasingValidator,
  domainRegistrationModuleNameValidator,
  domainRegistrationTldValidator,
  getDomainRegistrationLengthValidator(),
  getDomainRegistrationAllowedHyphensValidator(),
]
