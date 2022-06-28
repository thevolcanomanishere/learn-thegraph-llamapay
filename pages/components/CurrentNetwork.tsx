import React, { FC } from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";

const CurrentNetwork: FC = () => {
  const { chainId, setChainId } = React.useContext(
    ChainContext
  ) as IChainContext;
  const chainName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum";
      case 3:
        return "Rinkeby";
      case 4:
        return "Ropsten";
      case 42:
        return "Kovan";
      case 137:
        return "Polygon";
        return "Unknown";
    }
  };
  return (
    <>
      <div className="text-white">Current Network: {chainName(chainId)}</div>
      <button
        className="text-white"
        onClick={() => {
          setChainId(137);
        }}
      >
        Change Network
      </button>
    </>
  );
};

export default CurrentNetwork;
