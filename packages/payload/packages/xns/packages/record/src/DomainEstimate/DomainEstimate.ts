import type { BoundWitness } from '@xyo-network/boundwitness-model'
import type { HashLeaseEstimate } from '@xyo-network/diviner-hash-lease'
import type { WithSources } from '@xyo-network/payload-model'

import type { DomainRegistrationLease } from '../DomainRegistration/index.ts'

export type DomainEstimate = [
  BoundWitness,
  WithSources<HashLeaseEstimate>,
  WithSources<DomainRegistrationLease>,
]
