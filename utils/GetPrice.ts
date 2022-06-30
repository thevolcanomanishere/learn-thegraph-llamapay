import axios from "axios";

const supportedCurrencies = [
  "btc",
  "eth",
  "ltc",
  "bch",
  "bnb",
  "eos",
  "xrp",
  "xlm",
  "link",
  "dot",
  "yfi",
  "usd",
  "aed",
  "ars",
  "aud",
  "bdt",
  "bhd",
  "bmd",
  "brl",
  "cad",
  "chf",
  "clp",
  "cny",
  "czk",
  "dkk",
  "eur",
  "gbp",
  "hkd",
  "huf",
  "idr",
  "ils",
  "inr",
  "jpy",
  "krw",
  "kwd",
  "lkr",
  "mmk",
  "mxn",
  "myr",
  "ngn",
  "nok",
  "nzd",
  "php",
  "pkr",
  "pln",
  "rub",
  "sar",
  "sek",
  "sgd",
  "thb",
  "try",
  "twd",
  "uah",
  "vef",
  "vnd",
  "zar",
  "xdr",
  "xag",
  "xau",
  "bits",
  "sats",
];

const getAllSupportedBlockchains = async () =>
  await axios.get("https://api.coingecko.com/api/v3/asset_platforms");

export const getPriceOfTokens = async (tokens: string[], chainName: string) => {
  const result = await axios.get(
    `https://api.coingecko.com/api/v3/simple/token_price/${chainName.toLocaleLowerCase()}`,
    {
      params: {
        contract_addresses: tokens.join(","),
        vs_currencies: "usd",
      },
    }
  );
  return result.data;
};
