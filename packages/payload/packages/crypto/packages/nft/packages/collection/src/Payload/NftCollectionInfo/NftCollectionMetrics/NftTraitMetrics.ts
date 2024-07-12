import { BinomialDistributionParameters } from './BinomialDistributionParameters.js'

export interface NftTraitMetrics {
  binomial: Pick<BinomialDistributionParameters, 'p'>
  count: number
}
