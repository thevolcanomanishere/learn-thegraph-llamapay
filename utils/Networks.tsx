import { ChainId } from "eth-chains";
import {
  Arbitrum,
  Avalanche,
  Ethereum,
  Fantom,
  GnosisGno,
  Optimism,
  Polygon,
} from "@thirdweb-dev/chain-icons";

export const networks = [
  {
    name: "Ethereum",
    chainId: 1,
    explorer: "https://etherscan.io/address/",
    logo: <Ethereum className="h-5 " />,
  },
  {
    name: "Polygon",
    chainId: 137,
    explorer: "https://polygonscan.com/address/",
    logo: <Polygon className="h-5 " />,
  },
  {
    name: "Avalanche",
    chainId: 43114,
    explorer: "https://snowtrace.io/address/",
    logo: <Avalanche className="h-5 " />,
  },
  {
    name: "Fantom",
    chainId: 250,
    explorer: "https://ftmscan.com/address/",
    logo: <Fantom className="h-5 " />,
  },
  {
    name: "Arbritrum",
    chainId: 42161,
    explorer: "https://arbiscan.io/address/",
    logo: <Arbitrum className="h-5" />,
  },
  {
    name: "Optimism",
    chainId: ChainId.OptimisticEthereum,
    explorer: "https://optimistic.etherscan.io/address/",
    logo: <Optimism className="h-5 " />,
  },
  {
    name: "xDai/Gnosis",
    chainId: ChainId.XDAIChain,
    explorer: "https://blockscout.com/xdai/mainnet/address/",
    logo: <GnosisGno className="h-5 " />,
  },
];
