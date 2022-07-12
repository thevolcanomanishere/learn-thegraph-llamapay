import "../styles/globals.css";
import type { AppProps } from "next/app";
import ChainContext from "../utils/ChainContext";
import { useEffect, useState } from "react";
import { createClient, Provider } from "urql";
import { getGraphQLEndpoint } from "../utils/Networks";
import ProtocolContext, { ProtocolEnum } from "../utils/ProtocolContext";

const buildClient = (url: string) => {
  return createClient({
    url: url,
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const [chainId, setChainId] = useState(1);
  const [protocol, setProtocol] = useState(ProtocolEnum.LlamaPay);
  const [client, setClient] = useState(
    buildClient(getGraphQLEndpoint(1, ProtocolEnum.LlamaPay))
  );

  useEffect(() => {
    const url = getGraphQLEndpoint(chainId, protocol);
    setClient(buildClient(url));
  }, [protocol, chainId]);

  return (
    <Provider value={client}>
      <ProtocolContext.Provider value={{ protocol, setProtocol }}>
        <ChainContext.Provider value={{ chainId, setChainId }}>
          <Component {...pageProps} />
        </ChainContext.Provider>
      </ProtocolContext.Provider>
    </Provider>
  );
}

export default MyApp;
