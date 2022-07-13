import { Button } from "flowbite-react";
import React from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";
import { networks } from "../../utils/Networks";
import ProtocolContext, { IProtocolContext } from "../../utils/ProtocolContext";

const NetworkSelector = () => {
  const { chainId, setChainId } = React.useContext(
    ChainContext
  ) as IChainContext;
  const { protocol } = React.useContext(ProtocolContext) as IProtocolContext;

  const createButtons = () => {
    return networks.map((network) => {
      const active = network.chainId != chainId ? "gray" : "success";
      return (
        <Button
          // color={chainId === network.chainId ? "gray" : "blue"}
          color={active}
          key={network.chainId}
          onClick={() => setChainId(network.chainId)}
        >
          <div className="flex gap-2">
            {network.logo}
            {network.name}
          </div>
        </Button>
      );
    });
  };

  return (
    <div className="ml-6 mb-2 overflow-auto">
      <Button.Group outline={true}>{createButtons()}</Button.Group>
    </div>
  );
};

export default NetworkSelector;
