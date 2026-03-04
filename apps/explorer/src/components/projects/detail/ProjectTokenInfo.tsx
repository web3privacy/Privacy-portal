import { DetailCard, DetailSection, ValuePill } from "./detail-ui";
import type { Project } from "@/types/project";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function TokenChartMock() {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
      <svg viewBox="0 0 600 240" width="100%" height="160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tokFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(239,68,68,0.28)" />
            <stop offset="1" stopColor="rgba(239,68,68,0.00)" />
          </linearGradient>
        </defs>
        <path
          d="M0,90 C80,70 120,120 180,110 C260,95 260,160 330,155 C420,150 430,210 505,200 C560,192 585,205 600,196 L600,240 L0,240 Z"
          fill="url(#tokFade)"
        />
        <path
          d="M0,90 C80,70 120,120 180,110 C260,95 260,160 330,155 C420,150 430,210 505,200 C560,192 585,205 600,196"
          fill="none"
          stroke="rgba(239,68,68,0.85)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-black/35 dark:text-white/35">
        Powered by coingecko (placeholder)
      </div>
    </div>
  );
}

export function ProjectTokenInfo({ project }: { project: Project }) {
  const token = project.tokens?.[0];
  const linksAny = (project.links ?? {}) as Record<string, unknown>;
  const coingecko = asString(linksAny.coingecko);
  const tokenLink = asString(project.token_link) ?? asString(token?.token_link) ?? coingecko;

  const hasToken = Boolean(project.have_token || (project.tokens?.length ?? 0) > 0 || tokenLink);
  if (!hasToken) {
    return (
      <DetailSection id="token-info" title="Token Info">
        <DetailCard>
          <div className="flex items-center justify-between gap-4">
            <div className="text-[13px] text-black/55 dark:text-white/55">
              No token information available for this project.
            </div>
            <ValuePill>Not available</ValuePill>
          </div>
        </DetailCard>
      </DetailSection>
    );
  }

  const name = token?.name ?? "Token";
  const symbol = token?.symbol ?? "";

  return (
    <DetailSection id="token-info" title="Token Info">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <DetailCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-serif text-[18px] leading-none text-black dark:text-[#f2f4f6]">
                {name}
              </div>
              <div className="mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/45 dark:text-white/45">
                {symbol ? symbol : "N/A"}
              </div>
            </div>
            <ValuePill>{project.have_token ? "Live" : "Info"}</ValuePill>
          </div>

          <div className="mt-4 space-y-2 text-[13px] text-black/60 dark:text-white/60">
            {token?.network ? <div>Network: {token.network}</div> : null}
            {token?.contract_address ? (
              <div className="break-all">Contract: {token.contract_address}</div>
            ) : null}
            {tokenLink ? (
              <a
                href={tokenLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-black underline underline-offset-4 hover:text-black/75 dark:text-[#f2f4f6] dark:hover:text-white/85"
              >
                View on CoinGecko / Token link
                <span aria-hidden>→</span>
              </a>
            ) : null}
          </div>
        </DetailCard>

        <TokenChartMock />
      </div>
    </DetailSection>
  );
}

