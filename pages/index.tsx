import type { NextPage } from "next";
import ContractsList from "./components/ContractsList";
import Header from "./components/Header";

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

client
  .query({
    query: gql`
      {
        llamaPayFactories(first: 5) {
          id
          count
          address
          contracts {
            address
            token {
              symbol
            }
          }
        }
      }
    `,
  })
  .then((result) => console.log(result.data.llamaPayFactories));

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen col-auto">
      <Header />
      <ContractsList />
    </div>
  );
};

export default Home;
