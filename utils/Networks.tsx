import { ChainId } from "eth-chains";
import {
  Arbitrum,
  Avalanche,
  BinanceCoin,
  Ethereum,
  Fantom,
  GnosisGno,
  Optimism,
  Polygon,
} from "@thirdweb-dev/chain-icons";

type Network = {
  name: string;
  chainId: ChainId;
  explorer: string;
  logo: React.ReactElement;
  coinGecko?: string; // Name override for coingecko api
  rpc: string;
  graphQL: string;
};

const graphQLRoot =
  "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-";

export const networks: Network[] = [
  {
    name: "Ethereum",
    chainId: 1,
    explorer: "https://etherscan.io/address/",
    logo: <Ethereum className="h-5 " />,
    rpc: "https://cloudflare-eth.com/",
    graphQL: graphQLRoot + "mainnet",
  },
  {
    name: "Polygon",
    chainId: 137,
    explorer: "https://polygonscan.com/address/",
    logo: <Polygon className="h-5 " />,
    coinGecko: "polygon-pos",
    rpc: "https://polygon-rpc.com/",
    graphQL: graphQLRoot + "polygon",
  },
  {
    name: "Avalanche",
    chainId: 43114,
    explorer: "https://snowtrace.io/address/",
    logo: <Avalanche className="h-5 " />,
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    graphQL: graphQLRoot + "avalanche-mainnet",
  },
  {
    name: "Fantom",
    chainId: 250,
    explorer: "https://ftmscan.com/address/",
    logo: <Fantom className="h-5 " />,
    rpc: "https://rpc.ftm.tools",
    graphQL: graphQLRoot + "fantom",
  },
  {
    name: "Arbritrum",
    chainId: 42161,
    explorer: "https://arbiscan.io/address/",
    logo: <Arbitrum className="h-5" />,
    coinGecko: "arbitrum-one",
    rpc: "https://rpc.ankr.com/arbitrum",
    graphQL: graphQLRoot + "arbitrum",
  },
  {
    name: "Optimism",
    chainId: ChainId.OptimisticEthereum,
    explorer: "https://optimistic.etherscan.io/address/",
    logo: <Optimism className="h-5 " />,
    coinGecko: "optimistic-ethereum",
    rpc: "https://mainnet.optimism.io",
    graphQL: graphQLRoot + "optimism",
  },
  {
    name: "xDai/Gnosis",
    chainId: ChainId.XDAIChain,
    explorer: "https://blockscout.com/xdai/mainnet/address/",
    logo: <GnosisGno className="h-5 " />,
    coinGecko: "xdai",
    rpc: "https://rpc.xdaichain.com/",
    graphQL: graphQLRoot + "xdai",
  },
  {
    name: "BSC",
    chainId: ChainId.BinanceSmartChainMainnet,
    explorer: "https://bscscan.io/address/",
    logo: <BinanceCoin className="h-5 " />,
    coinGecko: "binance-smart-chain",
    rpc: "https://bsc-dataseed.binance.org/",
    graphQL: graphQLRoot + "bsc",
  },
];

export const getGraphQLEndpoint = (chainId: ChainId) => {
  const network = networks.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`No network found for chainId ${chainId}`);
  }
  return network.graphQL;
};

export const getRPCEndpoint = (chainId: ChainId) => {
  const network = networks.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`No network found for chainId ${chainId}`);
  }
  return network.rpc;
};
