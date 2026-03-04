/** Donation recipient address - same on all EVM chains */
export const DONATION_ADDRESS = "0x80E4551e8d72ef10C59e21E72598cA06Dad201eD";

/** Supported chains for donations - extensible config */
export type DonationChain = {
  chainId: number;
  name: string;
  shortName: string;
  explorerUrl: string;
  rpcUrls?: string[];
};

export const DONATION_CHAINS: DonationChain[] = [
  { chainId: 1, name: "Ethereum", shortName: "ETH", explorerUrl: "https://etherscan.io" },
  { chainId: 8453, name: "Base", shortName: "BASE", explorerUrl: "https://basescan.org" },
  { chainId: 42161, name: "Arbitrum One", shortName: "ARB", explorerUrl: "https://arbiscan.io" },
  { chainId: 10, name: "Optimism", shortName: "OP", explorerUrl: "https://optimistic.etherscan.io" },
  { chainId: 137, name: "Polygon", shortName: "MATIC", explorerUrl: "https://polygonscan.com" },
  { chainId: 59144, name: "Linea", shortName: "LINEA", explorerUrl: "https://lineascan.build" },
  { chainId: 100, name: "Gnosis", shortName: "GNO", explorerUrl: "https://gnosisscan.io" },
];

/** Preset donation amounts in USD */
export const DONATION_AMOUNTS_USD = [15, 50, 100, 500, 3000] as const;
