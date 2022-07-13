import { Tabs } from "flowbite-react";
import React from "react";
import ProtocolContext, { ProtocolEnum } from "../../utils/ProtocolContext";
import LlamaContractsTable from "./LlamaContractsTable";
import SablierContractsTable from "./SablierContractsTable";

const ProtocolTabs = () => {
  const { protocol, setProtocol } = React.useContext(ProtocolContext);

  const buttonStyle =
    "bg-white p-2 rounded border-solid border-sky-500 active:bg-sky-500";
  return (
    <div className="ml-4">
      <div className="flex gap-1 my-5">
        <button
          onClick={() => setProtocol(ProtocolEnum.LlamaPay)}
          className={buttonStyle}
        >
          Llama Pay 🦙
        </button>
        <button
          // onClick={() => setProtocol(ProtocolEnum.Sablier)}
          className={buttonStyle}
        >
          Sablier Finance (Coming Soon)
        </button>
      </div>
      {protocol === ProtocolEnum.LlamaPay && <LlamaContractsTable />}
      {protocol === ProtocolEnum.Sablier && <SablierContractsTable />}
    </div>
  );
};

export default ProtocolTabs;
