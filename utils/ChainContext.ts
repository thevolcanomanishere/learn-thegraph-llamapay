import React from "react";

export interface IChainContext {
    chainId: number
    setChainId: (chainId: number) => void
}

const ChainContext = React.createContext<IChainContext | undefined>({} as IChainContext);

export default ChainContext;