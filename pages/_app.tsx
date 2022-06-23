import "../styles/globals.css";
import type { AppProps } from "next/app";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

// TODO: make URI configurable
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
