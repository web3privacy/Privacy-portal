"use client";

import { formatWalletAddress } from "@/lib/wallet";
import { useWallet } from "@/components/wallet/wallet-provider";

type WalletConnectButtonProps = {
  compact?: boolean;
};

export function WalletConnectButton({ compact = false }: WalletConnectButtonProps) {
  const { walletAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();

  if (walletAddress) {
    return (
      <button
        type="button"
        onClick={disconnectWallet}
        className={`inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:border-[#3b3f46] dark:bg-[#1b1f25] dark:text-[#f2f4f6] dark:hover:bg-white/10 ${
          compact ? "w-10 justify-center px-0" : ""
        }`}
        title={walletAddress}
        aria-label="Disconnect wallet"
      >
        <span className="material-symbols-rounded text-[19px] leading-none">account_balance_wallet</span>
        {!compact && (
          <span className="text-[12px] font-semibold">
            {formatWalletAddress(walletAddress)} Disconnect
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isConnecting}
      onClick={() => {
        void connectWallet();
      }}
      className={`inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#3b3f46] dark:bg-[#1b1f25] dark:text-[#f2f4f6] dark:hover:bg-white/10 ${
        compact ? "w-10 justify-center px-0" : ""
      }`}
      aria-label="Connect wallet"
    >
      <span className="material-symbols-rounded text-[19px] leading-none">account_balance_wallet</span>
      {!compact && (
        <span className="text-[12px] font-semibold">{isConnecting ? "Connecting..." : "Connect wallet"}</span>
      )}
    </button>
  );
}
