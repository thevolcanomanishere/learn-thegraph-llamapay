import "../styles/globals.css";
import type { AppProps } from "next/app";
import ChainContext from "../utils/ChainContext";
import { useEffect, useState } from "react";
import { createClient, Provider } from "urql";
import { getGraphQLEndpoint } from "../utils/Networks";

// TODO: make URI configurable
const buildClient = (url: string) => {
  return createClient({
    url: url,
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState(1);
  const [client, setClient] = useState(buildClient(getGraphQLEndpoint(1)));

  useEffect(() => {
    const url = getGraphQLEndpoint(chainId);
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
