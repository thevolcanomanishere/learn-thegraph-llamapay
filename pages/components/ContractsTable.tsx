import { Spinner, Table } from "flowbite-react";
import { useState, useContext } from "react";
import { useQuery, gql } from "urql";
import { FC } from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";
import { useEffect } from "react";
import { ERC20BalanceCall, getERC20Balances } from "../../utils/chainCalls";
import ColorHash from "color-hash";
import { networks } from "../../utils/Networks";

const colorHash = new ColorHash();

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
  const { chainId } = useContext(ChainContext) as IChainContext;
  const [contracts, setContracts] = useState<[Contract]>();
  const [balances, setBalances] = useState<string[]>();
  const [streams, setStreams] =
    useState<{ payee: { address: string }; amountPerSec: string }[][]>();
  const [totalAmountPerSecond, setTotalAmountPerSecond] = useState<string[]>(
    []
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!address) return "";
    return `${
      networks.find((network) => network.chainId === chainId)?.explorer
    }${address}`;
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

  const openAddressInNewTab = (address: string) => {
    const url = createExplorerLink(address, chainId);
    window.open(url, "_blank");
  };

  const getBackgroundColor = (address: string) => {
    if (!address) return "black";
    return colorHash.hex(address);
  };

  useEffect(() => {
    if (data) {
      const filteredContracts = data.llamaPayFactories[0].contracts;
      // .map((contract: Contract) => {
      //   return {
      //     ...contract,
      //     streams: contract.streams.filter(
      //       (stream) => stream.active && !stream.paused
      //     ),
      //   };
      // })
      // .filter((contract: Contract) => contract.streams.length > 0);
      setContracts(filteredContracts);
      setStreams(filteredContracts.map((c: any) => c.streams));
      const tokens: ERC20BalanceCall[] = filteredContracts.map((token: any) => {
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
      const totalAmountPerSecond = getTotalAmountPerSecond(filteredContracts);
      setTotalAmountPerSecond(totalAmountPerSecond);

      getBalances();
    }
  }, [data, contracts, chainId]);

  return !mounted ? (
    <div>Loading...</div>
  ) : (
    <>
      <Table striped={true}>
        <Table.Head>
          {data &&
            contracts &&
            balances &&
            streams &&
            headers.map((header, index) => (
              <Table.HeadCell key={index}>{header}</Table.HeadCell>
            ))}
        </Table.Head>
        <Table.Body className="divide-y">
          {data &&
            contracts &&
            balances &&
            streams &&
            contracts.map((contract, index) => (
              <Table.Row key={index}>
                <Table.Cell
                  onClick={() => openAddressInNewTab(contract.address)}
                >
                  {shortenAddress(contract.address)}
                </Table.Cell>
                <Table.Cell className="flex">
                  <div
                    style={{
                      backgroundColor: getBackgroundColor(
                        contract.streams[0]?.payer.address
                      ),
                    }}
                    className={`h-[20px] w-[20px] mr-2 rounded`}
                  />
                  {shortenAddress(contract.streams[0]?.payer.address)}
                </Table.Cell>
                <Table.Cell>{calculateActivePayees(contract)}</Table.Cell>
                <Table.Cell>{totalAmountPerSecond[index]}</Table.Cell>
                <Table.Cell>
                  {balances[index]} {contract.token.symbol}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default ContractsTable;
