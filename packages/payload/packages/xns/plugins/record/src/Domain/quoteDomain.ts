import { PayloadBuilder } from '@xyo-network/payload-builder'

import { Quote, QuoteSchema, SupportedCurrency } from '../../payments'
import { Domain } from './Domain'
import { DomainLease, DomainLeaseSchema } from './DomainLease'

const TEN_MINUTES = 1000 * 60 * 10

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365

export const quoteDomain = async (
  domainPayload: Domain,
  duration: number = ONE_YEAR,
  currency: SupportedCurrency = 'USD',
): Promise<[Quote, DomainLease]> => {
  // TODO: Replace with actual quote algorithm
  const amount = await Promise.resolve(1000.1)
  const { domain } = domainPayload
  // TODO: Replace with times from actual quote algorithm
  const nbf = Date.now()
  const exp = nbf + TEN_MINUTES

  const domainLease: DomainLease = {
    domain,
    exp: nbf + duration,
    nbf,
    schema: DomainLeaseSchema,
  }
  const hashes = await Promise.all([PayloadBuilder.dataHash(domainLease)])
  const quote = { amount, currency, exp, hashes, nbf, schema: QuoteSchema }
  return [quote, domainLease]
}
