import { Arbitrum } from "@thirdweb-dev/chain-icons";
import React from "react";

// Arbitrum icon. This is necessary because the browser will not load the icon

const Header = () => {
  return (
    <div className="flex-row items-center h-50 mx-auto px-6">
      <h1 className="w-auto my-6 text-3xl font-bold text-black ">
        Streaming Salaries🚿
      </h1>
      {/* <p>
        Click on the contract addresses to open the explorer for that chain.
      </p>
      <p className="pb-5">
        Click on the payer address to open LlamaPay.io for that address.
      </p> */}
      <Arbitrum className="hidden" />
    </div>
  );
};

export default Header;
