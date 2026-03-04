"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { formatWalletAddress } from "@/lib/wallet";
import {
  DONATION_AMOUNTS_USD,
  DONATION_CHAINS,
  type DonationChain,
} from "@/lib/donation-config";
import {
  fetchEthUsdPrice,
  sendEthDonation,
  type SendDonationResult,
} from "@/lib/donation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CryptoDonationSection() {
  const { walletAddress, isConnecting, connectWallet } = useWallet();
  const [chain, setChain] = useState<DonationChain>(DONATION_CHAINS[0]);
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SendDonationResult | null>(null);

  useEffect(() => {
    fetchEthUsdPrice().then(setEthPrice);
  }, []);

  const handleDonate = useCallback(
    async (amountUsd: number) => {
      setResult(null);
      if (!walletAddress) {
        const addr = await connectWallet();
        if (!addr) {
          setResult({ success: false, error: "Please connect your wallet first." });
          return;
        }
      }
      setLoading(true);
      try {
        const res = await sendEthDonation(amountUsd, chain.chainId);
        setResult(res);
      } finally {
        setLoading(false);
      }
    },
    [walletAddress, chain.chainId, connectWallet]
  );

  const handleCustomDonate = useCallback(() => {
    const parsed = parseFloat(customAmount);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setResult({ success: false, error: "Enter a valid amount." });
      return;
    }
    handleDonate(parsed);
  }, [customAmount, handleDonate]);

  const ethForUsd = (usd: number) =>
    ethPrice > 0 ? (usd / ethPrice).toFixed(4) : "—";

  return (
    <section className="border-b border-[#e0e0e0] bg-white px-4 py-12 dark:border-[#2c3139] dark:bg-[#0f1318] sm:py-16 md:px-6 md:py-20">
      <div className="viewport-range-shell mx-auto max-w-[1140px] lg:max-w-[75vw]">
        <h2 className="text-center font-serif text-[22px] font-bold leading-tight text-[#121212] dark:text-[#f2f4f6] sm:text-[28px] md:text-[32px]">
          Consider a donation to support our future work
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd] sm:mt-4 sm:text-[15px]">
          Support our mission directly by donating crypto. Every dollar helps build a better future.
        </p>

        {/* Chain selector */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <span className="text-[14px] text-[#616161] dark:text-[#a7b0bd] sm:w-auto">Network:</span>
          <Select
            value={String(chain.chainId)}
            onValueChange={(v) => {
              const c = DONATION_CHAINS.find((x) => String(x.chainId) === v);
              if (c) setChain(c);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DONATION_CHAINS.map((c) => (
                <SelectItem key={c.chainId} value={String(c.chainId)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connect wallet */}
        {!walletAddress ? (
          <div className="mt-6 flex justify-center sm:mt-8">
            <Button
              onClick={() => connectWallet()}
              disabled={isConnecting}
              className="min-h-[44px] w-full rounded-lg bg-[#70ff88] px-6 py-3 font-semibold text-black hover:bg-[#5eef70] sm:w-auto"
            >
              {isConnecting ? "Connecting…" : "Connect wallet"}
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            Connected: {formatWalletAddress(walletAddress)}
          </p>
        )}

        {/* Preset amounts */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {DONATION_AMOUNTS_USD.map((amount) => (
            <div
              key={amount}
              className="flex flex-col items-center rounded-xl border border-[#e0e0e0] bg-[#f7f7f7] p-4 dark:border-[#2c3139] dark:bg-[#181d25] sm:p-6"
            >
              <span className="text-xl font-bold text-[#121212] dark:text-[#f2f4f6] sm:text-2xl">
                ${amount}
              </span>
              <p className="mt-0.5 text-[12px] text-[#616161] dark:text-[#a7b0bd] sm:mt-1 sm:text-[13px]">
                ~{ethForUsd(amount)} ETH
              </p>
              <Button
                onClick={() => handleDonate(amount)}
                disabled={!walletAddress || loading}
                className="mt-3 min-h-[44px] w-full rounded-lg bg-[#70ff88] px-4 py-3 font-semibold text-black hover:bg-[#5eef70] sm:mt-4 sm:py-2"
              >
                {loading ? "Sending…" : "DONATE"}
              </Button>
            </div>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mt-6 flex w-full flex-col gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-center">
          <div className="flex w-full flex-col gap-1 sm:max-w-[240px]">
            <label htmlFor="custom-donation" className="text-[13px] text-[#616161] dark:text-[#a7b0bd]">
              Custom amount (USD)
            </label>
            <Input
              id="custom-donation"
              type="number"
              min="0"
              step="1"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="min-h-[44px] rounded-lg border-[#d6d6d6] dark:border-[#3b3f46] dark:bg-[#181d25]"
            />
          </div>
          <Button
            onClick={handleCustomDonate}
            disabled={!walletAddress || loading}
            className="min-h-[44px] w-full rounded-lg bg-[#70ff88] px-6 py-3 font-semibold text-black hover:bg-[#5eef70] sm:w-auto"
            >
              {loading ? "Sending…" : "DONATE"}
            </Button>
        </div>

        {/* Result message */}
        {result && (
          <div
            className={`mt-6 rounded-lg px-4 py-3 text-center text-[14px] ${
              result.success
                ? "bg-[#70ff88]/20 text-[#122014] dark:text-[#70ff88]"
                : "bg-red-500/20 text-red-700 dark:text-red-400"
            }`}
          >
            {result.success ? (
              <span>
                Thank you! Transaction:{" "}
                <a
                  href={`${chain.explorerUrl}/tx/${result.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {result.txHash.slice(0, 10)}…
                </a>
              </span>
            ) : (
              result.error
            )}
          </div>
        )}

        <p className="mt-6 text-center text-[13px] text-[#616161] dark:text-[#a7b0bd]">
          Donations fund development, research, and education. Thank you for supporting privacy.
        </p>
      </div>
    </section>
  );
}
