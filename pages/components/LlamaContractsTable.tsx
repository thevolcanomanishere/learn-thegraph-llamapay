import { Spinner, Table, Tooltip } from "flowbite-react";
import { useState, useContext, useMemo } from "react";
import { useQuery, gql } from "urql";
import { FC } from "react";
import ChainContext, { IChainContext } from "../../utils/ChainContext";
import { useEffect } from "react";
import { ERC20BalanceCall, getERC20Balances } from "../../utils/ChainCalls";
import ColorHash from "color-hash";
import { getRPCEndpoint, networks } from "../../utils/Networks";
import { getPriceOfTokens } from "../../utils/GetPrice";

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

const LlamaContractsTable: FC = () => {
  const [result] = useQuery({
    query: GET_CONTRACTS,
  });
  const { data, fetching, error } = result;
  const { chainId } = useContext(ChainContext) as IChainContext;
  const [contracts, setContracts] = useState<[Contract]>();
  const tokens: ERC20BalanceCall[] | undefined = useMemo(() => {
    if (!contracts) return;
    return contracts.map((token: any) => {
      return {
        address: token.address,
        tokenAddress: token.token.address,
        decimals: token.token.decimals,
      };
    });
  }, [contracts]);
  const [tokenPrices, setTokenPrices] = useState<any>();
  const [balances, setBalances] = useState<string[]>();
  const [isFetchingBalances, setIsFetchingBalances] = useState(true);
  const [isFetchingPrices, setIsFetchingPrices] = useState(true);

  const totalAmountPerSecond = useMemo(() => {
    if (!contracts) return;
    return contracts.map((contract) => {
      const streamsAsNumbers = contract.streams.map((stream) => {
        if (!stream.active) return 0;
        if (stream.paused) return 0;
        return parseInt(stream.amountPerSec);
      });
      const reduced = streamsAsNumbers.reduce((a, b) => a + b, 0);
      return `${(reduced / 1e20).toString()} ${contract.token.symbol}`;
    });
  }, [contracts]);

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
    "$ p/s",
    "Tokens Left",
    "Value",
  ];

  const openUrlInNewTab = (url: string) => window.open(url, "_blank");

  const getBackgroundColor = (address: string) => {
    if (!address) return "black";
    return colorHash.hex(address);
  };

  const calculateTotalValue = (totalTokens: string, tokenAddress: string) => {
    if (!Object.hasOwn(tokenPrices, tokenAddress)) return "No $ value";
    const totalNumber = parseFloat(totalTokens);
    const usdValue = parseFloat(tokenPrices[tokenAddress].usd);
    return `$${(totalNumber * usdValue).toFixed(2)}`;
  };

  const calculateTotalValuePerSecond = (
    tokensPerSecond: string,
    tokenAddress: string
  ) => {
    if (!Object.hasOwn(tokenPrices, tokenAddress)) return "No $ value";
    const totalNumber = parseFloat(tokensPerSecond);
    const usdValue = parseFloat(tokenPrices[tokenAddress].usd);
    return `$${(totalNumber * usdValue).toFixed(8)}`;
  };

  useEffect(() => {
    if (data) {
      const filteredContracts = data.llamaPayFactories[0].contracts
        .map((contract: Contract) => {
          return {
            ...contract,
            streams: contract.streams.filter(
              (stream) => stream.active && !stream.paused
            ),
          };
        })
        .filter((contract: Contract) => {
          return contract.streams.length > 0;
        });
      setContracts(filteredContracts);
    }
  }, [data, chainId]);

  useEffect(() => {
    if (tokens) {
      (async () => {
        const balances = await getERC20Balances(chainId, tokens);
        if (balances) setBalances(balances);
        let chainInfo = networks.find((network) => network.chainId === chainId);
        const chainName = chainInfo?.coinGecko
          ? chainInfo.coinGecko
          : chainInfo?.name;

        if (chainName) {
          const tokenAddresses = tokens.map((token) => token.tokenAddress);
          const tPrices = await getPriceOfTokens(tokenAddresses, chainName);
          setTokenPrices(tPrices);
          // pause for 500 ms
          setTimeout(() => {
            setIsFetchingPrices(false);
            setIsFetchingBalances(false);
          }, 500);
        }
      })();
    }
  }, [tokens, chainId]);

  const isLoading =
    isFetchingBalances ||
    isFetchingPrices ||
    fetching ||
    !contracts ||
    !balances ||
    !totalAmountPerSecond;

  console.log("isLoading :" + isLoading);

  return isLoading ? (
    <div className="flex">
      <p>Loading...</p>
      <Spinner className="xl mr-3" />
      <p className="pl-3">Using RPC: {getRPCEndpoint(chainId)}</p>
    </div>
  ) : (
    <>
      <p className="mb-4 mx-2">Using RPC: {getRPCEndpoint(chainId)}</p>
      <Table striped={true}>
        <Table.Head className="bg-slate-200">
          {!isLoading &&
            headers.map((header, index) => (
              <Table.HeadCell key={index}>{header}</Table.HeadCell>
            ))}
        </Table.Head>
        <Table.Body className="divide-y">
          {!isLoading &&
            contracts.map((contract, index) => (
              <Table.Row key={index}>
                <Table.Cell
                  className="cursor-pointer"
                  onClick={() =>
                    openUrlInNewTab(
                      createExplorerLink(contract.address, chainId)
                    )
                  }
                >
                  <Tooltip content={contract.address}>
                    {shortenAddress(contract.address)}
                  </Tooltip>
                </Table.Cell>
                <Table.Cell
                  className="flex cursor-pointer"
                  onClick={() =>
                    openUrlInNewTab(
                      createLinkToLlamaPay(
                        contract.streams[0]?.payer.address,
                        chainId
                      )
                    )
                  }
                >
                  <div
                    style={{
                      backgroundColor: getBackgroundColor(
                        contract.streams[0]?.payer.address
                      ),
                    }}
                    className={`h-[20px] w-[20px] mr-2 rounded`}
                  />
                  <Tooltip content={contract.streams[0]?.payer.address}>
                    {shortenAddress(contract.streams[0]?.payer.address)}
                  </Tooltip>
                </Table.Cell>
                <Table.Cell>{calculateActivePayees(contract)}</Table.Cell>
                <Table.Cell>{totalAmountPerSecond[index]}</Table.Cell>
                <Table.Cell>
                  {calculateTotalValuePerSecond(
                    totalAmountPerSecond[index],
                    contract.token.address
                  )}
                </Table.Cell>
                <Table.Cell>{balances[index]}</Table.Cell>
                <Table.Cell>
                  {calculateTotalValue(balances[index], contract.token.address)}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default LlamaContractsTable;
