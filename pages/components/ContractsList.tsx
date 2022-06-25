import { gql, useQuery } from "@apollo/client";
import { utils } from "ethers";
import React, { useEffect, useState } from "react";
import { ERC20BalanceCall, getERC20Balances } from "../../utils/chainCalls";

const GET_CONTRACTS = gql`
  {
    llamaPayFactories(first: 50) {
      id
      count
      address
      contracts {
        address
        token {
          symbol
          address
          decimals
        }
        streams {
          amountPerSec
          active
          paused
          payer {
            address
          }
          payee {
            address
          }
        }
      }
    }
  }
`;

const shortenAddress = (address: string) => {
  if (!address) return "";
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};

type Contract = {
  address: string;
  token: {
    symbol: string;
    address: string;
    decimals: number;
  };
  streams: [
    {
      active: boolean;
      paused: boolean;
      payee: { address: string };
      amountPerSec: string;
      payer: { address: string };
    }
  ];
};

const getTotalAmountPerSecond = (contracts: Contract[]) => {
  return contracts.map((contract) => {
    const streamsAsNumbers = contract.streams.map((stream) => {
      if (!stream.active) return 0;
      if (stream.paused) return 0;
      return parseInt(stream.amountPerSec);
    });
    const reduced = streamsAsNumbers.reduce((a, b) => a + b, 0);
    return `${(reduced / 1e20).toString()} ${contract.token.symbol}`;
  });
};

const createExplorerLink = (address: string) => {
  //TODO: check current chain ID and use correct explorer
  return `https://etherscan.io/address/${address}`;
};

const createLinkToLlamaPay = (address: string, chainId: number = 1) => {
  return `https://llamapay.io/streams?chainId=${chainId}&address=${address}`;
};

const calculateActivePayees = (contract: Contract) => {
  return contract.streams.filter((stream) => stream.active && !stream.paused)
    .length;
};

const chainIds = [1, 137];

const ContractsList: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_CONTRACTS);
  const [chainId, setChainId] = useState(1);
  const [contracts, setContracts] = useState<[Contract]>();
  const [balances, setBalances] = useState<string[]>();
  const [streams, setStreams] =
    useState<{ payee: { address: string }; amountPerSec: string }[][]>();
  const [totalAmountPerSecond, setTotalAmountPerSecond] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (data) {
      setContracts(data.llamaPayFactories[0].contracts);
      console.log(data);
      setStreams(
        data.llamaPayFactories[0].contracts.map((c: any) => c.streams)
      );
      const tokens: ERC20BalanceCall[] =
        data.llamaPayFactories[0].contracts.map((token: any) => {
          return {
            address: token.address,
            tokenAddress: token.token.address,
            decimals: token.token.decimals,
          };
        });
      const getBalances = async () => {
        const balances = await getERC20Balances(1, tokens);
        setBalances(balances);
      };

      const test = getTotalAmountPerSecond(data.llamaPayFactories[0].contracts);
      console.log(test);
      setTotalAmountPerSecond(test);

      getBalances();
    }
  }, [data, contracts]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="p-6 text-white flex-row">
      <div className="flex w-full border-b">
        <p className="w-10">No</p>
        <p className="w-40">Contract Address</p>
        <p className="w-40">Payer</p>
        <p className="w-20">Payees</p>
        <p className="w-80">Total amount p/s</p>
        <p className="w-80">Tokens Left</p>
      </div>
      {contracts &&
        balances &&
        contracts.map((contract, index) => (
          <div className="flex" key={index}>
            <p className="w-10">{index + 1}</p>
            <a
              href={createExplorerLink(contract.address)}
              target="blank"
              className="w-40"
            >
              {shortenAddress(contract.address)}
            </a>
            <a
              href={createLinkToLlamaPay(contract.streams[0]?.payer.address)}
              target="blank"
              className="w-40"
            >
              {shortenAddress(contract.streams[0]?.payer.address)}
            </a>
            <p className="w-20">{calculateActivePayees(contract)}</p>
            <p className="w-80">{totalAmountPerSecond[index]}</p>
            <p className="w-80">
              {balances[index]} {contract.token.symbol}
            </p>
          </div>
        ))}
    </div>
  );
};

export default ContractsList;
