import { ChainId } from "eth-chains";

export const networks = [
  {
    name: "Ethereum",
    chainId: 1,
    explorer: "https://etherscan.io/address/",
  },
  {
    name: "Polygon",
    chainId: 137,
    explorer: "https://polygonscan.com/address/",
  },
  {
    name: "Avalanche",
    chainId: 43114,
    explorer: "https://snowtrace.io/address/",
  },
  {
    name: "Fantom",
    chainId: 250,
    explorer: "https://ftmscan.com/address/",
  },
  {
    name: "Arbritrum",
    chainId: 42161,
    explorer: "https://arbiscan.io/address/",
  },
  {
    name: "Optimism",
    chainId: ChainId.OptimisticEthereum,
    explorer: "https://optimistic.etherscan.io/address/",
  },
  {
    name: "xDai/Gnosis",
    chainId: ChainId.XDAIChain,
    explorer: "https://blockscout.com/xdai/mainnet/address/",
  },
];
