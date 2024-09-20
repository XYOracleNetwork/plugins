import type { SyncPayloadValidationFunction } from '@xyo-network/payload-model'

import type { EscrowTerms } from '../../Terms/index.ts'

export const getNbfExpValidator = (now: number, minRequiredDuration: number): SyncPayloadValidationFunction<EscrowTerms> => {
  const minExp = now + minRequiredDuration
  return (terms: EscrowTerms) => {
    const { exp, nbf } = terms
    if (nbf === undefined || nbf < now) {
      console.log(`EscrowTerms.nbf: invalid nbf ${terms.nbf}`)
      return false
    }
    if (exp === undefined || exp < minExp || nbf > exp) {
      console.log(`EscrowTerms.exp: invalid exp ${terms.exp}`)
      return false
    }
    return true
  }
}
