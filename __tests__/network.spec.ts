import { getERC20Balances } from "../utils/ChainCalls";
import { getPriceOfTokens } from "../utils/GetPrice";

describe("Test network calls", () => {
  it("should get the balances of a token", async () => {
    const tokens = [
      {
        address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
        tokenAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        decimals: 18,
      },
    ];
    const balances = await getERC20Balances(1, tokens);
    expect(balances).toBeDefined();
    if (balances) expect(balances.length).toBeGreaterThan(0);
  });

  it("should get the price of a token", async () => {
    const tokens = ["0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"];
    const prices = await getPriceOfTokens(tokens, "Ethereum");
    expect(prices).toBeDefined();
    if (prices)
      expect(prices).toHaveProperty(
        "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
      );
  });
});
