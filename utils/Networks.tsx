import { Chain, ChainId } from "eth-chains";
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
import { ProtocolEnum } from "./ProtocolContext";

const llamaPayGraphQLRoot =
  "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-";

const sablierFinaceGraphQLRoot =
  "https://api.thegraph.com/subgraphs/name/sablierhq/sablier";

export const networks = [
  {
    name: "Ethereum",
    chainId: ChainId.EthereumMainnet,
    explorer: "https://etherscan.io/address/",
    logo: <Ethereum className="h-5 " />,
    rpc: "https://cloudflare-eth.com/",
    llamaPayGraph: llamaPayGraphQLRoot + "mainnet",
    sablierFinaceGraph: sablierFinaceGraphQLRoot,
  },
  {
    name: "Polygon",
    chainId: ChainId.PolygonMainnet,
    explorer: "https://polygonscan.com/address/",
    logo: <Polygon className="h-5 " />,
    coinGecko: "polygon-pos",
    rpc: "https://polygon-rpc.com/",
    llamaPayGraph: llamaPayGraphQLRoot + "polygon",
    sablierFinaceGraph: sablierFinaceGraphQLRoot + "-matic",
  },
  {
    name: "Avalanche",
    chainId: ChainId.AvalancheMainnet,
    explorer: "https://snowtrace.io/address/",
    logo: <Avalanche className="h-5 " />,
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    llamaPayGraph: llamaPayGraphQLRoot + "avalanche-mainnet",
    sablierFinaceGraph: sablierFinaceGraphQLRoot + "-avalanche",
  },
  {
    name: "Fantom",
    chainId: ChainId.FantomOpera,
    explorer: "https://ftmscan.com/address/",
    logo: <Fantom className="h-5 " />,
    rpc: "https://rpc.ftm.tools",
    llamaPayGraph: llamaPayGraphQLRoot + "fantom",
    sablierFinaceGraph: "No graph",
  },
  {
    name: "Arbritrum",
    chainId: ChainId.ArbitrumOne,
    explorer: "https://arbiscan.io/address/",
    logo: <Arbitrum className="h-5" />,
    coinGecko: "arbitrum-one",
    rpc: "https://rpc.ankr.com/arbitrum",
    llamaPayGraph: llamaPayGraphQLRoot + "arbitrum",
    sablierFinaceGraph: sablierFinaceGraphQLRoot + "-arbitrum",
  },
  {
    name: "Optimism",
    chainId: ChainId.OptimisticEthereum,
    explorer: "https://optimistic.etherscan.io/address/",
    logo: <Optimism className="h-5 " />,
    coinGecko: "optimistic-ethereum",
    rpc: "https://mainnet.optimism.io",
    llamaPayGraph: llamaPayGraphQLRoot + "optimism",
    sablierFinaceGraph: sablierFinaceGraphQLRoot + "-optimism",
  },
  {
    name: "xDai/Gnosis",
    chainId: ChainId.XDAIChain,
    explorer: "https://blockscout.com/xdai/mainnet/address/",
    logo: <GnosisGno className="h-5 " />,
    coinGecko: "xdai",
    rpc: "https://rpc.xdaichain.com/",
    llamaPayGraph: llamaPayGraphQLRoot + "xdai",
    sablierFinaceGraph: "No graph",
  },
  {
    name: "BSC",
    chainId: ChainId.BinanceSmartChainMainnet,
    explorer: "https://bscscan.io/address/",
    logo: <BinanceCoin className="h-5 " />,
    coinGecko: "binance-smart-chain",
    rpc: "https://bsc-dataseed.binance.org/",
    llamaPayGraph: llamaPayGraphQLRoot + "bsc",
    sablierFinaceGraph: sablierFinaceGraphQLRoot + "-bsc",
  },
] as const;

export const getGraphQLEndpoint = (
  chainId: typeof networks[number]["chainId"],
  protocol: ProtocolEnum
) => {
  const network = networks.find(
    (n) => n.chainId === chainId
  ) as typeof networks[number];

  if (protocol === ProtocolEnum.LlamaPay) {
    return network.llamaPayGraph;
  }

  if (
    protocol === ProtocolEnum.Sablier &&
    chainId !== ChainId.XDAIChain &&
    chainId !== ChainId.FantomOpera
  ) {
    return network.sablierFinaceGraph;
  }
  return ""; // Make this not shit?
};

export const getRPCEndpoint = (chainId: ChainId) => {
  const network = networks.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`No network found for chainId ${chainId}`);
  }
  return network.rpc;
};
