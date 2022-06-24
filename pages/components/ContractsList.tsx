import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ERC20BalanceCall, getERC20Balances } from "../../utils/chainCalls";

const GET_CONTRACTS = gql`
  {
    llamaPayFactories(first: 5) {
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
      }
    }
  }
`;

const shortenAddress = (address: string) => {
  return (
    address.substring(0, 6) + "..." + address.substring(address.length - 4)
  );
};

type Contract = {
  address: string;
  token: {
    symbol: string;
    address: string;
  };
};

const ContractsList: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_CONTRACTS);
  const [contracts, setContracts] = useState<[Contract]>();
  const [balances, setBalances] = useState<string[]>();

  useEffect(() => {
    if (data) {
      setContracts(data.llamaPayFactories[0].contracts);
      const tokens: ERC20BalanceCall[] =
        data.llamaPayFactories[0].contracts.map((token: any) => {
          return {
            address: token.address,
            tokenAddress: token.token.address,
            decimals: token.token.decimals,
          };
        });
      const getBalances = async () => {
        const balances = await getERC20Balances(tokens);
        setBalances(balances);
      };
      getBalances();
    }
  }, [data, contracts]);

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="p-6 text-white flex-row">
      {contracts &&
        balances &&
        contracts.map((contract, index) => (
          <div className="flex" key={index}>
            <p className="pr-6">{index}</p>
            <p className="w-40">{shortenAddress(contract.address)}</p>
            <p>
              Token: {contract.token.symbol} - {balances[index]}
            </p>
          </div>
        ))}
    </div>
  );
};

export default ContractsList;
