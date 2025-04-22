import { Provider } from 'ethers';
import { Token } from '@uniswap/sdk-core';
import { getExchangeRate } from './getExchangeRate.ts';

const CHAIN_ID = 1; // Ethereum Mainnet

export const pricesFromUniswap4 = async (provider: Provider) => {
  const tokenA = new Token(CHAIN_ID, "0x55296f69f40ea6d20e478533c15a6b08b654e758", 18, 'XYO');
  const tokenB = new Token(CHAIN_ID, "0xdac17f958d2ee523a2206206994597c13d831ec7", 6, 'USDT');
  const rate = await getExchangeRate(provider, tokenA, tokenB, 3000);
  return rate
}
