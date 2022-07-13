import React from "react";

export enum ProtocolEnum {
  Sablier = "Sablier Finance",
  LlamaPay = "LlamaPay 🦙",
}

export interface IProtocolContext {
  protocol: ProtocolEnum;
  setProtocol: (protocol: ProtocolEnum) => void;
}

const ProtocolContext = React.createContext<IProtocolContext>({
  protocol: ProtocolEnum.LlamaPay,
  setProtocol: () => {},
});

export default ProtocolContext;
