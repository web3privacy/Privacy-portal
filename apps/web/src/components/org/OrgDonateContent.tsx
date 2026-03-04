"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DONATION_ADDRESS,
  DONATION_CHAINS,
  DONATION_AMOUNTS_USD,
} from "@/lib/org/donation-config";
import { fetchEthUsdPrice, sendEthDonation } from "@/lib/org/donation";

type Content = Record<string, unknown>;

function formatAddress(addr: string | null): string {
  if (!addr || addr.length < 10) return addr ?? "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

const ACCENT = "#70ff88";
const sectionStyle = { borderBottom: "1px solid #2c3139", background: "#0f1318", padding: "48px 16px 80px" as const };
const cardStyle = {
  border: "1px solid #2c3139",
  background: "#181d25",
  borderRadius: 12,
  padding: 20,
  display: "flex",
  flexDirection: "column" as const,
  height: "100%",
};
const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "10px 20px",
  borderRadius: 8,
  background: ACCENT,
  color: "#000",
  fontWeight: 600,
  textDecoration: "none",
  marginTop: 20,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14,
};

function DonateHeroSection({ donation }: { donation?: { title?: string; text?: string; ctaText?: string; ctaLink?: string } }) {
  return (
    <section style={{ position: "relative", borderBottom: "1px solid #2c3139", background: "#000", padding: "40px 16px 64px", textAlign: "center" }}>
      <div className="content-shell content-shell--with-padding" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <h1 style={{ fontFamily: "Domine, serif", fontSize: "clamp(24px, 4vw, 56px)", fontWeight: 700, lineHeight: 1.2, color: "#fff", margin: 0 }}>
          {donation?.title ?? "Support those who work for our commonality"}
        </h1>
        <p style={{ maxWidth: 640, margin: "12px auto 0", fontSize: "clamp(14px, 1.5vw, 16px)", lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>
          {donation?.text ?? "An open, anonymous, free, and secure privacy ecosystem as possible. Web3privacy is financed by our community. Events are always free, making privacy accessible as possible."}
        </p>
      </div>
    </section>
  );
}

function GetInvolvedSection() {
  const CARDS = [
    { title: "Volunteer 40+ hrs/month", description: "Help with various tasks – events, research, community management, and more.", cta: "APPLY NOW", href: "https://web3privacy.info/contribute" },
    { title: "Project Contribution 10+ hrs/month", description: "Contribute to specific projects. Code, design, write, or support the ecosystem.", cta: "APPLY NOW", href: "https://web3privacy.info/contribute" },
    { title: "Node Run", description: "Run a node for the network. Support decentralization and earn rewards.", cta: "READ MORE", href: "https://web3privacy.info" },
  ];
  return (
    <section style={sectionStyle}>
      <div className="content-shell content-shell--with-padding">
        <h2 style={{ textAlign: "center", fontFamily: "Domine, serif", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: "#f2f4f6", margin: 0 }}>GET INVOLVED</h2>
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 15, color: "#a7b0bd" }}>Contribute. Build with Us.</p>
        <p style={{ maxWidth: 640, margin: "12px auto 0", textAlign: "center", fontSize: 15, lineHeight: 1.6, color: "rgba(242,244,246,0.8)" }}>
          Choose how you want to support us and become a part of the Web3 Privacy movement.
        </p>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {CARDS.map((card) => (
            <div key={card.title} style={cardStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f2f4f6", margin: 0 }}>{card.title}</h3>
              <p style={{ marginTop: 12, flex: 1, fontSize: 14, lineHeight: 1.5, color: "#a7b0bd" }}>{card.description}</p>
              <a href={card.href} target="_blank" rel="noopener noreferrer" style={btnStyle}>{card.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NftPlaceholderSection() {
  const NFT_ITEMS = [
    { price: "0.05 ETH", description: "Mint one if you want to support privacy." },
    { price: "0.1 ETH", description: "Mint more if you want to support privacy more." },
    { price: "1 ETH", description: "Maximum support – mint our premium NFT." },
  ];
  return (
    <section style={sectionStyle}>
      <div className="content-shell content-shell--with-padding">
        <h2 style={{ textAlign: "center", fontFamily: "Domine, serif", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "#f2f4f6", margin: 0 }}>
          Support privacy on-chain by minting W3PN NFTs
        </h2>
        <p style={{ maxWidth: 560, margin: "12px auto 0", textAlign: "center", fontSize: 15, lineHeight: 1.6, color: "#a7b0bd" }}>
          By acquiring an NFT from our exclusive collection, you directly support our mission.
        </p>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {NFT_ITEMS.map((item) => (
            <div key={item.price} style={{ ...cardStyle, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1", background: "#1a1f27", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5568", fontSize: 48 }}>image</div>
              <div style={{ padding: 16 }}>
                <span style={{ fontWeight: 600, color: "#f2f4f6" }}>{item.price}</span>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#a7b0bd" }}>{item.description}</p>
                <button type="button" disabled title="Coming soon" style={{ ...btnStyle, width: "100%", marginTop: 16, cursor: "not-allowed", opacity: 0.7 }}>
                  MINT W3PN NFT
                </button>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#a7b0bd" }}>NFT minting coming soon.</p>
      </div>
    </section>
  );
}

function CryptoDonationSection() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chain, setChain] = useState(DONATION_CHAINS[0]!);
  const [ethPrice, setEthPrice] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: true; txHash: string } | { success: false; error: string } | null>(null);

  useEffect(() => {
    fetchEthUsdPrice().then(setEthPrice);
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setResult({ success: false, error: "No wallet found. Install MetaMask or Rabby." });
      return null;
    }
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[] | undefined;
      const addr = accounts?.[0] ?? null;
      setWalletAddress(addr);
      return addr;
    } catch (e) {
      setResult({ success: false, error: (e as Error)?.message || "Connection failed." });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDonate = useCallback(
    async (amountUsd: number) => {
      setResult(null);
      let addr = walletAddress;
      if (!addr) {
        addr = await connectWallet();
        if (!addr) return;
      }
      setLoading(true);
      try {
        const res = await sendEthDonation(amountUsd, chain.chainId, DONATION_ADDRESS);
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

  const ethForUsd = (usd: number) => (ethPrice > 0 ? (usd / ethPrice).toFixed(4) : "—");

  const inputStyle = { width: "100%", minHeight: 44, padding: "10px 14px", borderRadius: 8, border: "1px solid #3b3f46", background: "#181d25", color: "#fff", fontSize: 15, boxSizing: "border-box" as const };
  const selectStyle = { minHeight: 44, padding: "10px 14px", borderRadius: 8, border: "1px solid #3b3f46", background: "#181d25", color: "#fff", fontSize: 14, minWidth: 180 };
  const cardStyleCrypto = { border: "1px solid #2c3139", background: "#181d25", borderRadius: 12, padding: 20, textAlign: "center" as const };

  return (
    <section style={sectionStyle}>
      <div className="content-shell content-shell--with-padding">
        <h2 style={{ textAlign: "center", fontFamily: "Domine, serif", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "#f2f4f6", margin: 0 }}>
          Consider a donation to support our future work
        </h2>
        <p style={{ maxWidth: 560, margin: "12px auto 0", textAlign: "center", fontSize: 15, lineHeight: 1.6, color: "#a7b0bd" }}>
          Support our mission directly by donating crypto. Every dollar helps build a better future.
        </p>
        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14, color: "#a7b0bd" }}>Network:</span>
          <select
            value={chain.chainId}
            onChange={(e) => {
              const c = DONATION_CHAINS.find((x) => x.chainId === Number(e.target.value));
              if (c) setChain(c);
            }}
            style={selectStyle}
          >
            {DONATION_CHAINS.map((c) => (
              <option key={c.chainId} value={c.chainId}>{c.name}</option>
            ))}
          </select>
        </div>
        {!walletAddress ? (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={() => connectWallet()} disabled={isConnecting} style={btnStyle}>
              {isConnecting ? "Connecting…" : "Connect wallet"}
            </button>
          </div>
        ) : (
          <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "#a7b0bd" }}>Connected: {formatAddress(walletAddress)}</p>
        )}
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 16 }}>
          {DONATION_AMOUNTS_USD.map((amount) => (
            <div key={amount} style={cardStyleCrypto}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#f2f4f6" }}>${amount}</span>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#a7b0bd" }}>~{ethForUsd(amount)} ETH</p>
              <button type="button" onClick={() => handleDonate(amount)} disabled={!walletAddress || loading} style={{ ...btnStyle, width: "100%", marginTop: 12 }}>
                {loading ? "Sending…" : "DONATE"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 240, width: "100%" }}>
            <label htmlFor="custom-donation" style={{ fontSize: 13, color: "#a7b0bd" }}>Custom amount (USD)</label>
            <input id="custom-donation" type="number" min={0} step={1} placeholder="Enter amount" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} style={inputStyle} />
          </div>
          <button type="button" onClick={handleCustomDonate} disabled={!walletAddress || loading} style={btnStyle}>
            {loading ? "Sending…" : "DONATE"}
          </button>
        </div>
        {result && (
          <div
            style={{
              marginTop: 24,
              padding: "12px 16px",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 14,
              background: result.success ? "rgba(112,255,136,0.2)" : "rgba(239,68,68,0.2)",
              color: result.success ? ACCENT : "#f87171",
            }}
          >
            {result.success ? (
              <span>
                Thank you! Transaction:{" "}
                <a href={`${chain.explorerUrl}/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                  {result.txHash.slice(0, 10)}…
                </a>
              </span>
            ) : (
              result.error
            )}
          </div>
        )}
        <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#a7b0bd" }}>Donations fund development, research, and education. Thank you for supporting privacy.</p>
      </div>
    </section>
  );
}

function MembershipSection() {
  const TIERS = [
    { title: "Individual", description: "For individuals who want to join our community and support us.", benefits: ["Access to members-only content", "Early access to events", "Voting rights"], price: "€100 / Year", cta: "BECOME A MEMBER", href: "https://web3privacy.info/membership/" },
    { title: "Organizations", description: "For organizations who want to support our mission and get involved.", benefits: ["Visibility on our website", "Co-host events", "Partnership opportunities"], price: "€15K - €100K / Year", cta: "REQUEST MEMBERSHIP", href: "https://web3privacy.info/membership/" },
    { title: "Event Sponsor", description: "For organizations who want to sponsor an event and get maximum visibility.", benefits: ["Brand visibility at events", "Speaking opportunities", "Networking access"], price: "€1K - €40K / Event", cta: "BECOME A SPONSOR", href: "https://web3privacy.info/membership/" },
  ];
  return (
    <section style={sectionStyle}>
      <div className="content-shell content-shell--with-padding">
        <h2 style={{ textAlign: "center", fontFamily: "Domine, serif", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 700, color: "#f2f4f6", margin: 0 }}>Membership</h2>
        <p style={{ maxWidth: 560, margin: "12px auto 0", textAlign: "center", fontSize: 15, lineHeight: 1.6, color: "#a7b0bd" }}>
          Join our community as a member and get exclusive benefits while supporting our cause.
        </p>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {TIERS.map((tier) => (
            <div key={tier.title} style={cardStyle}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f2f4f6", margin: 0 }}>{tier.title}</h3>
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5, color: "#a7b0bd" }}>{tier.description}</p>
              <ul style={{ marginTop: 16, paddingLeft: 20, listStyle: "disc", fontSize: 14, color: "#a7b0bd", lineHeight: 1.6 }}>
                {tier.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <p style={{ marginTop: 16, fontWeight: 600, color: "#f2f4f6" }}>{tier.price}</p>
              <a href={tier.href} target="_blank" rel="noopener noreferrer" style={btnStyle}>{tier.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OrgDonateContent({ content }: { content: Content }) {
  const donation = (content.donation ?? {}) as { title?: string; text?: string; ctaText?: string; ctaLink?: string };
  return (
    <div className="landing-root" style={{ minHeight: "100vh", background: "#0f1318", color: "#f2f4f6" }}>
      <main style={{ paddingTop: 82 }}>
        <div className="page-content-wrap page-content-wrap--with-padding">
          <DonateHeroSection donation={donation} />
          <GetInvolvedSection />
          <NftPlaceholderSection />
          <CryptoDonationSection />
          <MembershipSection />
        </div>
      </main>
    </div>
  );
}
