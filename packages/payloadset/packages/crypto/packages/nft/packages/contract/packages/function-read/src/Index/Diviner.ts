import { IndexingDiviner } from '@xyo-network/diviner-indexing'

import { CryptoContractIndexingDivinerLabels } from './Labels'

export class CryptoContractIndexingDiviner extends IndexingDiviner {
  static labels: CryptoContractIndexingDivinerLabels = CryptoContractIndexingDivinerLabels
}
