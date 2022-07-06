import { providers } from "@0xsequence/multicall";
import { ethers, utils, providers as ethersProviders } from "ethers";
import ERC20ABI from "../Abis/ERC20.json";
import { getRPCEndpoint } from "./Networks";

export type ERC20BalanceCall = {
  address: string;
  tokenAddress: string;
  decimals: number;
};

const createProvider = (chainId: number) => {
  const rpc = getRPCEndpoint(chainId);
  return new providers.MulticallProvider(
    new ethersProviders.JsonRpcProvider(rpc)
  );
};

export const getERC20Balances = async (
  chainId: number,
  tokens: ERC20BalanceCall[]
) => {
  const provider = createProvider(chainId);
  const contracts = tokens.map((token) => {
    return new ethers.Contract(token.tokenAddress, ERC20ABI, provider);
  });

  try {
    const calls = contracts.map((contract, index) => {
      return contract.balanceOf(tokens[index].address);
    });

    const results = await Promise.all(calls);

    return results.map((result, index) => {
      return utils.formatUnits(result, tokens[index].decimals);
    });
  } catch (error) {
    console.log("Error getting ERC20 balance: " + error);
  }
};
