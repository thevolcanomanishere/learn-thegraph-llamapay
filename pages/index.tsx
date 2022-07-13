import type { NextPage } from "next";
import Head from "next/head";
import Header from "./components/Header";
import NetworkSelector from "./components/NetworkSelector";
import ProtocolTabs from "./components/ProtocolTabs";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen col-auto px-4 flex-row justify-items-center items-center">
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦙</text></svg>"
        />
      </Head>
      <Header />
      <NetworkSelector />
      <div className="ml-3">
        <ProtocolTabs />
      </div>
      {/* <LlamaContractsTable /> */}
    </div>
  );
};

export default Home;
