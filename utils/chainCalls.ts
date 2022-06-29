import { providers } from "@0xsequence/multicall";
import { ChainId } from "eth-chains";
import { ethers, utils, providers as ethersProviders } from "ethers";
import ERC20ABI from "../Abis/ERC20.json";

export type ERC20BalanceCall = {
  address: string;
  tokenAddress: string;
  decimals: number;
};

const createProvider = (chainId: number) => {
  let apiUrl;

  switch (chainId) {
    case 1:
      apiUrl = "https://cloudflare-eth.com/";
      break;
    case 137:
      apiUrl = "https://polygon-rpc.com/";
      break;
    case ChainId.AvalancheMainnet:
      apiUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case ChainId.FantomOpera:
      apiUrl = "https://rpc.ftm.tools";
      break;
    default:
      break;
  }
  return new providers.MulticallProvider(
    new ethersProviders.JsonRpcProvider(apiUrl)
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
    console.log(error);
  }
};
