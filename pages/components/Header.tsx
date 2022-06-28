import React from "react";
import CurrentNetwork from "./CurrentNetwork";

const Header = () => {
  return (
    <div className="flex-row items-center h-24 mx-auto px-4">
      <h1 className="w-auto text-4xl font-bold text-[#39FF14] border-white border-b-2">
        Llama Pay Contracts
      </h1>
      <CurrentNetwork/>
    </div>
  );
};

export default Header;
