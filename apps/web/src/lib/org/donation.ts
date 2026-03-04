const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
let cachedEthPrice: number | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

export async function fetchEthUsdPrice(): Promise<number> {
  if (cachedEthPrice != null && Date.now() - cachedAt < CACHE_MS) return cachedEthPrice;
  const res = await fetch(COINGECKO_API);
  const data = await res.json();
  const price = data?.ethereum?.usd ?? 0;
  if (price > 0) {
    cachedEthPrice = price;
    cachedAt = Date.now();
  }
  return price;
}

function usdToWeiHex(usd: number, ethUsdPrice: number): string {
  if (ethUsdPrice <= 0) return "0x0";
  const ethAmount = usd / ethUsdPrice;
  const wei = BigInt(Math.floor(ethAmount * 1e18));
  return "0x" + wei.toString(16);
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

function getEthereumProvider(): Window["ethereum"] | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export async function sendEthDonation(
  amountUsd: number,
  chainId: number,
  donationAddress: string
): Promise<{ success: true; txHash: string } | { success: false; error: string }> {
  const provider = getEthereumProvider();
  if (!provider) {
    return { success: false, error: "No wallet found. Install MetaMask or Rabby." };
  }
  const ethPrice = await fetchEthUsdPrice();
  if (ethPrice <= 0) {
    return { success: false, error: "Could not fetch ETH price. Try again later." };
  }
  const valueHex = usdToWeiHex(amountUsd, ethPrice);
  try {
    const currentChain = await provider.request({ method: "eth_chainId" });
    const currentChainId = parseInt(String(currentChain), 16);
    if (currentChainId !== chainId) {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }],
      });
    }
    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [{ to: donationAddress, value: valueHex, gasLimit: "0x5208" }],
    });
    const hash = typeof txHash === "string" ? txHash : String(txHash ?? "");
    if (!hash) return { success: false, error: "Transaction failed. No hash returned." };
    return { success: true, txHash: hash };
  } catch (err) {
    const msg = (err as Error)?.message ?? String(err);
    if (msg.includes("User denied") || msg.includes("user rejected")) {
      return { success: false, error: "Transaction rejected." };
    }
    return { success: false, error: msg || "Transaction failed." };
  }
}
