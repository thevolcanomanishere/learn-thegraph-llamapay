import { Button } from "flowbite-react";
import React from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";
import { networks } from "../../utils/Networks";

const NetworkSelector = () => {
  const { chainId, setChainId } = React.useContext(
    ChainContext
  ) as IChainContext;

  const createButtons = () => {
    return networks.map((network) => {
      return (
        <Button
          color="gray"
          outline={chainId === network.chainId}
          key={network.chainId}
          onClick={() => setChainId(network.chainId)}
        >
          {network.name}
        </Button>
      );
    });
  };

  return (
    <div className="ml-3 mb-2">
      <Button.Group outline={true}>{createButtons()}</Button.Group>
    </div>
  );
};

export default NetworkSelector;
