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

// https://api.etherscan.io/api
//    ?module=account
//    &action=tokenbalance
//    &contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055
//    &address=0xe04f27eb70e025b78871a2ad7eabe85e61212761
//    &tag=latest&apikey=YourApiKeyToken

const API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCANAPI || "M2FJABY1V2USTHUEXF1HTMPYFEMW66J55P";
const getTokenBalance = async (contractAddress: string, address: string) => {
  return fetch(
    `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${API_KEY}`
  )
    .then((res) => res.json())
    .then((res) => res.result)
    .catch((err) => console.log(err));
};

const ContractsList: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery(GET_CONTRACTS);
  const [contracts, setContracts] = useState<[Contract]>();
  const [balances, setBalances] = useState<string[]>();
  console.log(data);
  //   "llamaPayFactories[0].contracts"

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

  const renderContract = async (contract: Contract) => {
    return (
      <div className="flex py-5" key={contract.address}>
        <div className="pr-10">Symbol: {contract.token.symbol}</div>
        <div>Address: {shortenAddress(contract.token.address)}</div>
      </div>
    );
  };

  if (contracts)
    getTokenBalance(contracts[0].token.address, contracts[0].address);

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
