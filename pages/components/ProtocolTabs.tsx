import { Tabs } from "flowbite-react";
import React from "react";
import ProtocolContext, { ProtocolEnum } from "../../utils/ProtocolContext";
import LlamaContractsTable from "./LlamaContractsTable";
import SablierContractsTable from "./SablierContractsTable";

const ProtocolTabs = () => {
  const { protocol, setProtocol } = React.useContext(ProtocolContext);
  const handleTabClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
    //@ts-ignore
    setProtocol(e.target.innerText);

  return (
    <Tabs.Group
      aria-label="Tabs with underline"
      style="underline"
      onClick={(e) => handleTabClick(e)}
    >
      <Tabs.Item title="LlamaPay 🦙">
        {protocol === ProtocolEnum.LlamaPay && <LlamaContractsTable />}
      </Tabs.Item>
      <Tabs.Item title="Sablier Finance">
        {protocol === ProtocolEnum.Sablier && <SablierContractsTable />}
      </Tabs.Item>
    </Tabs.Group>
  );
};

export default ProtocolTabs;
