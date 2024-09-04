import { isModuleName } from '@xyo-network/module-model'
import type { Payload, PayloadValidationFunction } from '@xyo-network/payload-model'
import type { DomainFields } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH, MIN_DOMAIN_LENGTH } from '../Constants.ts'

export const domainCasingValidator: PayloadValidationFunction<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
) => {
  const { domain } = payload
  // Check if all lowercase
  if (domain.toLowerCase() !== domain) {
    console.log('name must be lowercase')
    return false
  }
  return true
}

export const domainModuleNameValidator: PayloadValidationFunction<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
) => {
  const { domain } = payload

  // check if domain is a valid name
  if (!isModuleName(domain)) {
    console.log(`Domain is not a valid module name: ${domain}`)
    return false
  }

  return true
}

export const domainTldValidator: PayloadValidationFunction<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
) => {
  const { tld } = payload
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

export const getDomainLengthValidator = (
  minNameLength = MIN_DOMAIN_LENGTH,
  maxLength = MAX_DOMAIN_LENGTH,
): PayloadValidationFunction<Payload<DomainFields>> => {
  return (payload: Payload<DomainFields>) => {
    const { domain } = payload
    // Check if min length
    if (domain.length < minNameLength) {
      console.log(`name must be at least ${minNameLength} characters`)
      return false
    }
    if (domain.length > maxLength) {
      console.log(`name must be at least ${maxLength} characters`)
      return false
    }
    return true
  }
}

export const getDomainAllowedHyphensValidator = (
  options?: { end?: boolean; start?: boolean },
): PayloadValidationFunction<Payload<DomainFields>> => {
  return (payload: Payload<DomainFields>) => {
    const { domain } = payload
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

export const XnsNameSimpleValidators = [
  domainCasingValidator,
  domainModuleNameValidator,
  domainTldValidator,
  getDomainLengthValidator(),
  getDomainAllowedHyphensValidator(),
]
