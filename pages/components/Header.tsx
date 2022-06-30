import React from "react";

const Header = () => {
  return (
    <div className="flex-row items-center h-32 mx-auto px-4">
      <h1 className="w-auto my-6 text-4xl font-bold text-black border-white border-b-2">
        🦙 LlamaPay Contracts
      </h1>
      <p>
        Click on the contract addresses to open the explorer for that chain.
      </p>
      <p>Click on the payer address to open LlamaPay.io for that address.</p>
    </div>
  );
};

export default Header;
