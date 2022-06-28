import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import ChainContext from "../utils/ChainContext";
import { useEffect, useState } from "react";
import { ChainId } from "eth-chains";

  // TODO: make URI configurable
const defaultClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet",
  cache: new InMemoryCache(),
});

const getLlamaPayGraphQLEndpoint = (chainId: number) => {
  let root = "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-"
  switch (chainId) {
    case 1:
      root += "mainnet";
    case 137:
      root += "polygon";
    case ChainId.ArbitrumOne:
      root += "arbitrum"
    case ChainId.AvalancheMainnet:
      root += "avalanche-mainnet"
    case ChainId.FantomOpera:
      root += "fantom"
    case ChainId.OptimisticEthereum:
      root += "optimism"
    case ChainId.XDAIChain:
      root += "xdai"
      break;
  }
  return root;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState(1)
  const [apolloClient, setApolloClient] = useState(defaultClient);
  
  useEffect(() => {
    const client = new ApolloClient({
      uri: getLlamaPayGraphQLEndpoint(chainId),
      cache: new InMemoryCache(),
    });
    setApolloClient(client);
  }, [chainId])

  return (
    <ApolloProvider client={apolloClient}>
      <ChainContext.Provider value={{chainId, setChainId}}>
        <Component {...pageProps} />
      </ChainContext.Provider>
    </ApolloProvider>
  );
}

export default MyApp;
