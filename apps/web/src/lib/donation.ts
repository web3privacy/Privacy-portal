"use client";

import { getEthereumProvider } from "./wallet";
import { DONATION_ADDRESS } from "./donation-config";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

let cachedEthPrice: number | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000; // 1 min

export async function fetchEthUsdPrice(): Promise<number> {
  if (cachedEthPrice != null && Date.now() - cachedAt < CACHE_MS) {
    return cachedEthPrice;
  }
  const res = await fetch(COINGECKO_API);
  const data = (await res.json()) as { ethereum?: { usd?: number } };
  const price = data.ethereum?.usd ?? 0;
  if (price > 0) {
    cachedEthPrice = price;
    cachedAt = Date.now();
  }
  return price;
}

/** Convert USD to ETH (wei as hex string for eth_sendTransaction) */
export function usdToWeiHex(usd: number, ethUsdPrice: number): string {
  if (ethUsdPrice <= 0) return "0x0";
  const ethAmount = usd / ethUsdPrice;
  const wei = BigInt(Math.floor(ethAmount * 1e18));
  return "0x" + wei.toString(16);
}

export type SendDonationResult = { success: true; txHash: string } | { success: false; error: string };

/** Send ETH donation. Switches chain if needed. */
export async function sendEthDonation(
  amountUsd: number,
  chainId: number
): Promise<SendDonationResult> {
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
      const switchRes = await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + chainId.toString(16) }],
      });
      if (switchRes === null) {
        return { success: false, error: "User rejected chain switch." };
      }
    }

    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: undefined, // wallet will use current account
          to: DONATION_ADDRESS,
          value: valueHex,
          gasLimit: "0x5208", // 21000
        },
      ],
    });

    const hash = typeof txHash === "string" ? txHash : String(txHash ?? "");
    if (!hash) {
      return { success: false, error: "Transaction failed. No hash returned." };
    }
    return { success: true, txHash: hash };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("User denied") || msg.includes("user rejected")) {
      return { success: false, error: "Transaction rejected." };
    }
    return { success: false, error: msg || "Transaction failed." };
  }
}
