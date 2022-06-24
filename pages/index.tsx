import type { NextPage } from "next";
import ContractsList from "./components/ContractsList";
import Header from "./components/Header";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen col-auto px-4 flex-row justify-items-center items-center">
      <Header />
      <ContractsList />
    </div>
  );
};

export default Home;
