import { isModuleName } from '@xyo-network/module-model'
import type { Payload } from '@xyo-network/payload-model'
import type { DomainFields } from '@xyo-network/xns-record-payload-plugins'

import { MAX_DOMAIN_LENGTH, MIN_DOMAIN_LENGTH } from '../Constants.ts'

export type PayloadValidationFunctionWithError<T extends Payload = Payload> = (payload: T, onErrors?: (message: string[]) => void) => boolean | Promise<boolean>

export const domainCasingValidator: PayloadValidationFunctionWithError<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
  onErrors?: (message: string[]) => void,
) => {
  const { domain } = payload
  // Check if all lowercase
  if (domain.toLowerCase() !== domain) {
    onErrors?.(['name must be lowercase'])
    return false
  }
  return true
}

export const domainModuleNameValidator: PayloadValidationFunctionWithError<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
  onErrors?: (message: string[]) => void,
) => {
  const { domain } = payload

  // check if domain is a valid name
  if (!isModuleName(domain)) {
    onErrors?.([`Domain is not a valid module name: ${domain}`])
    return false
  }

  return true
}

export const domainTldValidator: PayloadValidationFunctionWithError<Payload<DomainFields>> = (
  payload: Payload<DomainFields>,
  onErrors?: (message: string[]) => void,
) => {
  const { tld } = payload
  const errorMessages: string[] = []

  // Check if all lowercase
  if (tld.toLowerCase() !== tld) {
    errorMessages.push('TLD must be lowercase')
  }
  // Check if supported TLDs
  if (tld !== 'xyo') {
    errorMessages.push('Only XYO TLD currently supported')
  }
  if (errorMessages.length > 0) {
    onErrors?.(errorMessages)
    return false
  }
  return true
}

export const getDomainLengthValidator = (
  minNameLength = MIN_DOMAIN_LENGTH,
  maxLength = MAX_DOMAIN_LENGTH,
): PayloadValidationFunctionWithError<Payload<DomainFields>> => {
  return (
    payload: Payload<DomainFields>,
    onErrors?: (message: string[]) => void,
  ) => {
    const { domain } = payload
    const errorMessages: string[] = []

    // Check if min length
    if (domain.length < minNameLength) {
      errorMessages.push(`name must be at least ${minNameLength} characters`)
    }

    if (domain.length > maxLength) {
      errorMessages.push(`name must be no more than ${maxLength} characters`)
    }

    if (errorMessages.length > 0) {
      onErrors?.(errorMessages)
      return false
    }

    return true
  }
}

export const getDomainAllowedHyphensValidator = (
  options?: { end?: boolean; start?: boolean },
): PayloadValidationFunctionWithError<Payload<DomainFields>> => {
  return (
    payload: Payload<DomainFields>,
    onErrors?: (message: string[]) => void,
  ) => {
    const { domain } = payload
    const { start, end } = options ?? {}
    const errorMessages: string[] = []

    if (!start && domain.startsWith('-')) {
      errorMessages.push('name cannot start with hyphen')
    }

    if (!end && domain.endsWith('-')) {
      errorMessages.push('name cannot end with hyphen')
    }

    if (errorMessages.length > 0) {
      onErrors?.(errorMessages)
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

export const XnsNameSimpleValidatorsWithErrors = (onErrors: (message: string[]) => void) => [
  domainCasingValidator,
  domainModuleNameValidator,
  domainTldValidator,
  getDomainLengthValidator(),
  getDomainAllowedHyphensValidator(),
].map(validator => (payload: Payload<DomainFields>) => validator(payload, onErrors))
