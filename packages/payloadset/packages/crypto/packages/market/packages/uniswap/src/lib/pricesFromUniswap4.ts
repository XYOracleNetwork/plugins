import { ethers, Provider, ZeroAddress } from 'ethers';
import { Token, Price, Currency } from '@uniswap/sdk-core';
import { tickToPrice } from '@uniswap/v4-sdk';

// Minimal ABI for pool slot0
const POOL_ABI = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16, uint16, uint16, uint8, bool)"
];

// Minimal ABI for Uniswap v4 factory
const FACTORY_ABI = [
  "function getPool(address tokenA, address tokenB, uint24 fee, address hook) view returns (address)"
];

// Constants
const CHAIN_ID = 1; // Ethereum Mainnet
const UNISWAP_V4_FACTORY = "0x000000000004444c5dc75cB358380D2e3dE08A90"; // replace with actual v4 factory address

const getExchangeRate = async (
  provider: Provider,
  tokenA: Token,
  tokenB: Token,
  fee: number,
  hookAddress: string = ZeroAddress
): Promise<Price<Currency, Currency> | null> => {

  // Init factory
  const factory = new ethers.Contract(UNISWAP_V4_FACTORY, FACTORY_ABI, provider);

  // Sort tokens lexicographically as per Uniswap convention
  const [token0, token1] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
    ? [tokenA.address, tokenB.address]
    : [tokenB.address, tokenA.address];

  const poolAddress: string = await factory.getPool(token0, token1, fee, hookAddress);
  if (poolAddress === ZeroAddress) {
    console.warn("Pool does not exist for these parameters.");
    return null;
  }

  const pool = new ethers.Contract(poolAddress, POOL_ABI, provider);
  const slot0 = await pool.slot0();
  const currentTick = slot0.tick;

  const price = tickToPrice(tokenA, tokenB, currentTick);
  return price;
}

// export const pricesFromUniswap4 = async (provider: Provider): Promise<UniswapCryptoPair[]> => {
export const pricesFromUniswap4 = async (provider: Provider) => {
  const tokenA = new Token(CHAIN_ID, "0x55296f69f40ea6d20e478533c15a6b08b654e758", 18, 'XYO');
  const tokenB = new Token(CHAIN_ID, "0xdac17f958d2ee523a2206206994597c13d831ec7", 18, 'USDT');
  const rate = await getExchangeRate(provider, tokenA, tokenB, 3000);
}
