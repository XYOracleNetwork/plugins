import { Token } from '@uniswap/sdk-core'
import { Pool } from '@uniswap/v3-sdk'
import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import type { EnumValue } from '@xylabs/enum'
import { Enum } from '@xylabs/enum'
import type { IERC20Metadata } from '@xyo-network/open-zeppelin-typechain'
import { IERC20Metadata__factory } from '@xyo-network/open-zeppelin-typechain'
import type { IUniswapV3Pool } from '@xyo-network/uniswap-typechain'
import { IUniswapV3Pool__factory } from '@xyo-network/uniswap-typechain'
import type { Provider } from 'ethers'

import { logErrors, logErrorsAsync } from './logErrors.ts'
import { EthersUniswap3PoolSlot0Wrapper } from './Uniswap3PoolSlot0Wrapper.ts'

export const ChainId = Enum({
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
})

export type ChainId = EnumValue<typeof ChainId>

// null is used as 'in-progress'
const waitNotNull = async (closure: () => unknown) => {
  while (closure() === null) await delay(10)
}

export class EthersUniSwap3Pair {
  protected address: string
  protected provider: Provider

  private _pool?: Pool | null
  private _poolContract?: IUniswapV3Pool
  private _slot0?: EthersUniswap3PoolSlot0Wrapper | null
  private _tokenContracts: (IERC20Metadata | null | undefined)[] = [undefined, undefined]
  private _tokens: (Token | null | undefined)[] = [undefined, undefined]

  constructor(address: string, provider: Provider) {
    this.address = address
    this.provider = provider
  }

  async pool(): Promise<Pool> {
    return await logErrorsAsync(async () => {
      await waitNotNull(() => this._pool)
      this._pool = this._pool || null
      const slot0 = await this.slot0()
      this._pool
        = this._pool === null
          ? new Pool(
            await this.token(0),
            await this.token(1),
            Number(slot0.feeProtocol),
            `0x${slot0.sqrtPriceX96.toString(16)}`,
            `0x${(await this.poolContract().liquidity()).toString(16)}`,
            Number(slot0.tick),
          )
          : this._pool
      return assertEx(this._pool)
    })
  }

  poolContract() {
    return logErrors(() => {
      this._poolContract = this._poolContract ?? IUniswapV3Pool__factory.connect(this.address, this.provider)
      return assertEx(this._poolContract)
    })
  }

  async price() {
    return await logErrorsAsync(async () => {
      const tokenIndexes: (0 | 1)[] = [0, 1]
      const pool = await this.pool()
      const tokens = await Promise.all(tokenIndexes.map(value => this.token(value)))
      const tokenContracts = await Promise.all(tokenIndexes.map(value => this.tokenContract(value)))
      const tokenPrices = tokens.map(token => Number.parseFloat(pool.priceOf(token).toSignificant()))
      const tokenSymbols = tokens.map((token, index) => assertEx(token.symbol, () => `Token[${index}] Missing Symbols`).toLowerCase())
      const result = {
        tokens: await Promise.all(
          tokenIndexes.map(async (value) => {
            return {
              address: await tokenContracts[value].getAddress(), symbol: tokenSymbols[value], value: tokenPrices[value],
            }
          }),
        ),
      }
      return result
    })
  }

  async slot0(): Promise<EthersUniswap3PoolSlot0Wrapper> {
    return await logErrorsAsync(async () => {
      await waitNotNull(() => this._slot0)
      this._slot0 = this._slot0 || null
      if (this._slot0 === null) {
        const poolContract = this.poolContract()
        const slot = await poolContract.slot0()
        this._slot0 = this._slot0 ?? new EthersUniswap3PoolSlot0Wrapper(slot)
      }
      return assertEx(this._slot0)
    })
  }

  async token(index: 0 | 1): Promise<Token> {
    return await logErrorsAsync(async () => {
      await waitNotNull(() => this._tokens[index])
      this._tokens[index] = this._tokens[index] || null
      const tokenContract = await this.tokenContract(index)
      this._tokens[index]
        = this._tokens[index]
          ?? new Token(
            ChainId.MAINNET,
            await tokenContract.getAddress(),
            Number(await tokenContract.decimals()),
            await tokenContract.symbol(),
            await tokenContract.name(),
          )
      return assertEx(this._tokens[index])
    })
  }

  async tokenContract(index: 0 | 1): Promise<IERC20Metadata> {
    return await logErrorsAsync(async () => {
      await waitNotNull(() => this._tokenContracts[index])
      this._tokenContracts[index] = this._tokenContracts[index] || null
      this._tokenContracts[index]
        = this._tokenContracts[index]
          ?? IERC20Metadata__factory.connect(await (index === 0 ? this.poolContract().token0() : this.poolContract().token1()), this.provider)
      return assertEx(this._tokenContracts[index])
    })
  }
}
