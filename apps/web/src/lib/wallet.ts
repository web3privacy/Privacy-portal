export const WALLET_STORAGE_KEY = "privacy-portal-wallet-address";

type EthereumProvider = {
  isMetaMask?: boolean;
  isRabby?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  providers?: EthereumProvider[];
};

type EthereumWindow = Window & {
  ethereum?: EthereumProvider;
};

function getGlobalEthereum(): EthereumProvider | null {
  if (typeof window === "undefined") {
    return null;
  }
  return (window as EthereumWindow).ethereum ?? null;
}

export function getEthereumProvider(): EthereumProvider | null {
  const ethereum = getGlobalEthereum();
  if (!ethereum) {
    return null;
  }

  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    const preferred = ethereum.providers.find((provider) => provider.isRabby || provider.isMetaMask);
    return preferred ?? ethereum.providers[0] ?? null;
  }

  return ethereum;
}

export function normalizeWalletAddress(address: string): string {
  return address.trim().toLowerCase();
}

export function isEthereumAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function formatWalletAddress(address: string): string {
  if (!isEthereumAddress(address)) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

