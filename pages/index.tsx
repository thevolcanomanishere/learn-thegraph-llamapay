import type { NextPage } from "next";
import ContractsTable from "./components/ContractsTable";
import Header from "./components/Header";
import NetworkSelector from "./components/NetworkSelector";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen col-auto px-4 flex-row justify-items-center items-center">
      <Header />
      <NetworkSelector />
      <ContractsTable />
    </div>
  );
};

export default Home;
