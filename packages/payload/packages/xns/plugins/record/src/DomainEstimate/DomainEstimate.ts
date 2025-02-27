import { BoundWitness } from '@xyo-network/boundwitness-model'
import { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import { WithSources } from '@xyo-network/payload-model'

import { DomainRegistrationLease } from '../DomainRegistration/index.ts'

export type DomainEstimate = [
  BoundWitness,
  WithSources<HashLeaseEstimate>,
  WithSources<DomainRegistrationLease>,
]
