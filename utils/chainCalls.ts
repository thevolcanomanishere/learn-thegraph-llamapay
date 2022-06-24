import { providers } from "@0xsequence/multicall";
import { ethers, utils, providers as ethersProviders } from "ethers";
import ERC20ABI from "../Abis/ERC20.json";

const ALCHEMY_API =
  process.env.NEXT_PUBLC_ALCHEMY_API || "https://cloudflare-eth.com/";

console.log(`ALCHEMY_API: ${ALCHEMY_API}`);

const provider = new providers.MulticallProvider(
  new ethersProviders.JsonRpcProvider(ALCHEMY_API)
);

export type ERC20BalanceCall = {
  address: string;
  tokenAddress: string;
  decimals: number;
};

export const getERC20Balances = async (tokens: ERC20BalanceCall[]) => {
  const contracts = tokens.map((token) => {
    return new ethers.Contract(token.tokenAddress, ERC20ABI, provider);
  });

  const calls = contracts.map((contract, index) => {
    return contract.balanceOf(tokens[index].address);
  });

  const results = await Promise.all(calls);

  return results.map((result, index) => {
    return utils.formatUnits(result, tokens[index].decimals);
  });
};
