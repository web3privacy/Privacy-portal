"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getEthereumProvider,
  isEthereumAddress,
  normalizeWalletAddress,
  WALLET_STORAGE_KEY,
} from "@/lib/wallet";

type WalletContextValue = {
  walletAddress: string;
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(WALLET_STORAGE_KEY) ?? "";
    if (isEthereumAddress(stored)) {
      setWalletAddress(normalizeWalletAddress(stored));
      return;
    }

    const provider = getEthereumProvider();
    void provider
      ?.request({ method: "eth_accounts" })
      .then((accountsValue) => {
        const accounts = Array.isArray(accountsValue)
          ? accountsValue.map((value) => String(value))
          : [];
        const normalized = normalizeWalletAddress(accounts[0] ?? "");
        if (isEthereumAddress(normalized)) {
          setWalletAddress(normalized);
          window.localStorage.setItem(WALLET_STORAGE_KEY, normalized);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const provider = getEthereumProvider();
    if (!provider?.on || !provider.removeListener) {
      return;
    }

    const handleAccountsChanged = (accountsValue: unknown) => {
      const accounts = Array.isArray(accountsValue)
        ? accountsValue.map((value) => String(value))
        : [];
      const firstAddress = accounts[0] ?? "";
      const normalized = normalizeWalletAddress(firstAddress);

      if (isEthereumAddress(normalized)) {
        setWalletAddress(normalized);
        window.localStorage.setItem(WALLET_STORAGE_KEY, normalized);
      } else {
        setWalletAddress("");
        window.localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    };

    provider.on("accountsChanged", handleAccountsChanged);
    return () => {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    const provider = getEthereumProvider();
    if (!provider) {
      return null;
    }

    setIsConnecting(true);
    try {
      const response = await provider.request({ method: "eth_requestAccounts" });
      const addresses = Array.isArray(response) ? response.map((value) => String(value)) : [];
      const address = normalizeWalletAddress(addresses[0] ?? "");

      if (!isEthereumAddress(address)) {
        return null;
      }

      setWalletAddress(address);
      window.localStorage.setItem(WALLET_STORAGE_KEY, address);
      return address;
    } catch {
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletAddress("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(WALLET_STORAGE_KEY);
    }
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      walletAddress,
      isConnecting,
      connectWallet,
      disconnectWallet,
    }),
    [walletAddress, isConnecting, connectWallet, disconnectWallet]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }
  return context;
}
