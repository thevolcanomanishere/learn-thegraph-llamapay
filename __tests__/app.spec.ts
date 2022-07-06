import { getERC20Balances } from "../utils/ChainCalls";

describe("test erc20balance", () => {
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
});
