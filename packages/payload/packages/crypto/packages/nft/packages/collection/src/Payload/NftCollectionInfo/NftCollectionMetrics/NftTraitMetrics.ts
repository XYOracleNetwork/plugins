import { BinomialDistributionParameters } from './BinomialDistributionParameters.ts'

export interface NftTraitMetrics {
  binomial: Pick<BinomialDistributionParameters, 'p'>
  count: number
}
