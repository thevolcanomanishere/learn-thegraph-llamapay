import { Spinner, Table } from "flowbite-react";
import { useState, useContext } from "react";
import { useQuery, gql } from "urql";
import { Chain, chains } from "eth-chains";
import { FC } from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";
import { useEffect } from "react";
import { ERC20BalanceCall, getERC20Balances } from "../../utils/chainCalls";

interface Contract {
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
}

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

const ContractsTable: FC = () => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_CONTRACTS,
  });
  const { data, fetching, error } = result;
  const { chainId, setChainId } = useContext(ChainContext) as IChainContext;
  const [contracts, setContracts] = useState<[Contract]>();
  const [balances, setBalances] = useState<string[]>();
  const [streams, setStreams] =
    useState<{ payee: { address: string }; amountPerSec: string }[][]>();
  const [totalAmountPerSecond, setTotalAmountPerSecond] = useState<string[]>(
    []
  );

  const calculateActivePayees = (contract: Contract) => {
    return contract.streams.filter((stream) => stream.active && !stream.paused)
      .length;
  };

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 4)
    );
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

  const createExplorerLink = (address: string, chainId: number) => {
    //TODO: check current chain ID and use correct explorer
    const chain = chains.getById(chainId) as Chain;
    if (chain && chain.explorers)
      return chain.explorers[0].url + "address/" + address;
    return "";
  };

  const createLinkToLlamaPay = (address: string, chainId: number = 1) => {
    return `https://llamapay.io/streams?chainId=${chainId}&address=${address}`;
  };

  const headers = [
    "Contract Address",
    "Payer",
    "Payees",
    "Total amount p/s",
    "Tokens Left",
  ];

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
        const balances = await getERC20Balances(chainId, tokens);
        setBalances(balances);
      };
      const totalAmountPerSecond = getTotalAmountPerSecond(
        data.llamaPayFactories[0].contracts
      );
      setTotalAmountPerSecond(totalAmountPerSecond);

      getBalances();
    }
  }, [data, contracts, chainId]);

  return (
    <Table striped={true}>
      <Table.Head>
        {headers.map((header, index) => (
          <Table.HeadCell key={index}>{header}</Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body className="divide-y">
        {fetching ? (
          <Spinner size="xl" />
        ) : (
          data &&
          contracts &&
          balances &&
          contracts.map((contract, index) => (
            <Table.Row key={index}>
              <Table.Cell>{shortenAddress(contract.address)}</Table.Cell>
              <Table.Cell>
                {shortenAddress(contract.streams[0]?.payer.address)}
              </Table.Cell>
              <Table.Cell>{calculateActivePayees(contract)}</Table.Cell>
              <Table.Cell>{totalAmountPerSecond[index]}</Table.Cell>
              <Table.Cell>
                {balances[index]} {contract.token.symbol}
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default ContractsTable;
