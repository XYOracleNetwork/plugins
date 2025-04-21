import { assert, Contract, ethers, Provider, ZeroAddress, keccak256, AbiCoder } from 'ethers';
import { Token, Price, Currency } from '@uniswap/sdk-core';
import { IPoolManager, IPoolManager__factory } from '@xyo-network/uniswap-typechain/v4'

const CHAIN_ID = 1; // Ethereum Mainnet
const STATE_VIEW_ADDRESS = "0x7ffe42c4a5deea5b0fec41c94c136cf115597227"; // State view contract address
const STATE_VIEW_ABI = [{"inputs":[{"internalType":"contract IPoolManager","name":"_poolManager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getFeeGrowthGlobals","outputs":[{"internalType":"uint256","name":"feeGrowthGlobal0","type":"uint256"},{"internalType":"uint256","name":"feeGrowthGlobal1","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"}],"name":"getFeeGrowthInside","outputs":[{"internalType":"uint256","name":"feeGrowthInside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"bytes32","name":"positionId","type":"bytes32"}],"name":"getPositionInfo","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"getPositionInfo","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"bytes32","name":"positionId","type":"bytes32"}],"name":"getPositionLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"}],"name":"getSlot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint24","name":"protocolFee","type":"uint24"},{"internalType":"uint24","name":"lpFee","type":"uint24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int16","name":"tick","type":"int16"}],"name":"getTickBitmap","outputs":[{"internalType":"uint256","name":"tickBitmap","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickFeeGrowthOutside","outputs":[{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickInfo","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"},{"internalType":"uint256","name":"feeGrowthOutside0X128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthOutside1X128","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"PoolId","name":"poolId","type":"bytes32"},{"internalType":"int24","name":"tick","type":"int24"}],"name":"getTickLiquidity","outputs":[{"internalType":"uint128","name":"liquidityGross","type":"uint128"},{"internalType":"int128","name":"liquidityNet","type":"int128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolManager","outputs":[{"internalType":"contract IPoolManager","name":"","type":"address"}],"stateMutability":"view","type":"function"}]


const getPoolId = (
  currencyA: Token,
  currencyB: Token,
  fee: number,
  tickSpacing: number,
  hooks: string
): string =>{
  const [currency0, currency1] = currencyA.sortsBefore(currencyB) ? [currencyA, currencyB] : [currencyB, currencyA]
  const currency0Addr = currency0.isNative ? ZeroAddress : currency0.wrapped.address
  const currency1Addr = currency1.isNative ? ZeroAddress : currency1.wrapped.address
  return keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ['address', 'address', 'uint24', 'int24', 'address'],
        [currency0Addr, currency1Addr, fee, tickSpacing, hooks]
      ),
  )
}

const getExchangeRate = async (
  provider: Provider,
  tokenA: Token,
  tokenB: Token,
  fee: number,
  hookAddress: string = ZeroAddress
): Promise<string> => {

  const stateView = new Contract(STATE_VIEW_ADDRESS, STATE_VIEW_ABI, provider);

  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA];

  const poolId: string = getPoolId(token0, token1, fee, 60, hookAddress);
  if (poolId === ZeroAddress) throw new Error("Invalid poolId");
  const response = await stateView.getSlot0(poolId);
  console.log("response", response)
  return ""

}

// export const pricesFromUniswap4 = async (provider: Provider): Promise<UniswapCryptoPair[]> => {
export const pricesFromUniswap4 = async (provider: Provider) => {
  const tokenA = new Token(CHAIN_ID, "0x55296f69f40ea6d20e478533c15a6b08b654e758", 18, 'XYO');
  const tokenB = new Token(CHAIN_ID, "0xdac17f958d2ee523a2206206994597c13d831ec7", 18, 'USDT');
  const rate = await getExchangeRate(provider, tokenA, tokenB, 3000);
  return rate
}
