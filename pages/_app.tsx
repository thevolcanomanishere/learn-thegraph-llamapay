import "../styles/globals.css";
import type { AppProps } from "next/app";
import ChainContext from "../utils/ChainContext";
import { useEffect, useState } from "react";
import { ChainId } from "eth-chains";
import { createClient, Provider } from "urql";

// TODO: make URI configurable
const buildClient = (url: string) => {
  return createClient({
    url: url,
  });
};

const getLlamaPayGraphQLEndpoint = (chainId: number) => {
  let root = "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-";
  switch (chainId) {
    case 1:
      root += "mainnet";
      break;
    case 137:
      root += "polygon";
      break;
    case ChainId.ArbitrumOne:
      root += "arbitrum";
      break;
    case ChainId.AvalancheMainnet:
      root += "avalanche-mainnet";
      break;
    case ChainId.FantomOpera:
      root += "fantom";
      break;
    case ChainId.OptimisticEthereum:
      root += "optimism";
      break;
    case ChainId.XDAIChain:
      root += "xdai";
      break;
    case ChainId.BinanceSmartChainMainnet:
      root += "bsc";
      break;
  }
  return root;
};

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState(1);
  const [client, setClient] = useState(
    buildClient(getLlamaPayGraphQLEndpoint(1))
  );

  useEffect(() => {
    const url = getLlamaPayGraphQLEndpoint(chainId);
    setClient(buildClient(url));
  }, [chainId]);

  return (
    <Provider value={client}>
      <ChainContext.Provider value={{ chainId, setChainId }}>
        <Component {...pageProps} />
      </ChainContext.Provider>
    </Provider>
  );
}

export default MyApp;
