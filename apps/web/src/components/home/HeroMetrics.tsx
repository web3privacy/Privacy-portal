"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

type HeroProject = {
  id: string;
  name: string;
  slug?: string;
  geckoId?: string | null;
};

type SeriesPoint = { t: number; v: number };

type HeroMetrics = {
  name?: string;
  slug?: string;
  geckoId?: string | null;
  tvl?: SeriesPoint[];
  price?: SeriesPoint[];
  error?: string;
};

function formatUsd(v: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(v);
}

function formatNumber(v: number): string {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(v);
}

function deltaPct(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) return null;
  return ((b - a) / a) * 100;
}

function buildLinePath(series: SeriesPoint[], w: number, h: number, pad = 10) {
  if (series.length < 2) return "";
  const tMin = Math.min(...series.map((p) => p.t));
  const tMax = Math.max(...series.map((p) => p.t));
  const vMin = Math.min(...series.map((p) => p.v));
  const vMax = Math.max(...series.map((p) => p.v));
  const dt = tMax - tMin || 1;
  const dv = vMax - vMin || 1;

  const pts = series.map((p) => {
    const x = pad + ((p.t - tMin) / dt) * (w - pad * 2);
    const y =
      pad + (1 - (p.v - vMin) / dv) * (h - pad * 2); // invert
    return [x, y] as const;
  });

  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
}

function buildAreaPath(series: SeriesPoint[], w: number, h: number, pad = 10) {
  const line = buildLinePath(series, w, h, pad);
  if (!line) return "";
  const tMin = Math.min(...series.map((p) => p.t));
  const tMax = Math.max(...series.map((p) => p.t));
  const dt = tMax - tMin || 1;
  const xLast = pad + ((series[series.length - 1].t - tMin) / dt) * (w - pad * 2);
  const xFirst = pad + ((series[0].t - tMin) / dt) * (w - pad * 2);
  const yBase = h - pad;
  return `${line} L ${xLast} ${yBase} L ${xFirst} ${yBase} Z`;
}

function Chart({
  series,
  mode,
  className,
}: {
  series: SeriesPoint[];
  mode: "price" | "tvl";
  className?: string;
}) {
  const w = 1000;
  const h = 280;
  const pad = 14;
  const line = buildLinePath(series, w, h, pad);
  const area = buildAreaPath(series, w, h, pad);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[14px] border border-black/10 bg-[#f5f5f5] dark:border-white/10 dark:bg-[#0f1318]",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="block h-[170px] md:h-[220px]"
      >
        <defs>
          <linearGradient id="gridFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(0,0,0,0.06)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.0)" />
          </linearGradient>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={mode === "tvl" ? "#f08c2a" : "#1f64ff"} stopOpacity="0.35" />
            <stop offset="1" stopColor={mode === "tvl" ? "#f08c2a" : "#1f64ff"} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        <g opacity="0.55">
          {Array.from({ length: 10 }).map((_, i) => {
            const x = (w / 10) * i;
            return (
              <line
                key={`vx-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={h}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1"
              />
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = (h / 6) * i;
            return (
              <line
                key={`hy-${i}`}
                x1={0}
                y1={y}
                x2={w}
                y2={y}
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1"
              />
            );
          })}
        </g>

        <rect x="0" y="0" width={w} height={h} fill="url(#gridFade)" />

        {area ? <path d={area} fill="url(#areaFill)" /> : null}
        {line ? (
          <path
            d={line}
            fill="none"
            stroke={mode === "tvl" ? "#f08c2a" : "#1f64ff"}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
    </div>
  );
}

function MetricChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full px-4 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-black/5 text-black/60 hover:bg-black/10 hover:text-black dark:bg-white/10 dark:text-white/65 dark:hover:bg-white/15 dark:hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export function HeroMetrics({
  projects,
  initialId,
}: {
  projects: HeroProject[];
  initialId?: string;
}) {
  const [selectedId, setSelectedId] = React.useState(
    initialId ?? projects[0]?.id ?? ""
  );
  const selected = React.useMemo(
    () => projects.find((p) => p.id === selectedId) ?? projects[0],
    [projects, selectedId]
  );

  const [data, setData] = React.useState<HeroMetrics | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"tvl" | "price">("tvl");

  React.useEffect(() => {
    const p = selected;
    if (!p) return;

    const qs = new URLSearchParams();
    if (p.slug) qs.set("slug", p.slug);
    if (p.geckoId) qs.set("geckoId", p.geckoId);

    setLoading(true);
    fetch(`/api/hero-metrics?${qs.toString()}`)
      .then((r) => r.json())
      .then((json: HeroMetrics) => {
        setData(json);
        if (mode === "tvl" && !json.tvl?.length && json.price?.length) {
          setMode("price");
        }
      })
      .catch((e) => setData({ error: e instanceof Error ? e.message : "Failed" }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const tvlSeries = data?.tvl ?? [];
  const priceSeries = data?.price ?? [];

  const tvlLast = tvlSeries.length ? tvlSeries[tvlSeries.length - 1].v : null;
  const tvlFirst = tvlSeries.length ? tvlSeries[0].v : null;
  const tvlPct =
    tvlFirst != null && tvlLast != null ? deltaPct(tvlFirst, tvlLast) : null;

  const priceLast = priceSeries.length
    ? priceSeries[priceSeries.length - 1].v
    : null;
  const priceFirst = priceSeries.length ? priceSeries[0].v : null;
  const pricePct =
    priceFirst != null && priceLast != null
      ? deltaPct(priceFirst, priceLast)
      : null;

  const activeSeries = mode === "tvl" ? tvlSeries : priceSeries;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 px-4 py-3 dark:border-white/10 md:px-5">
        <div className="flex max-w-full flex-1 items-center gap-2 overflow-x-auto pb-1">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
                p.id === selectedId
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-black/5 text-black/55 hover:bg-black/10 hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/15 dark:hover:text-white"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
        >
          Show more
          <Icon name="expand_more" size={20} />
        </button>
      </div>

      <div className="px-4 py-6 md:px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
              Selected
            </div>
            <div className="mt-1 font-serif text-[22px] leading-none text-black dark:text-[#f2f4f6]">
              {selected?.name ?? "Project"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <MetricChip active={mode === "tvl"} onClick={() => setMode("tvl")}>
              TVL
            </MetricChip>
            <MetricChip
              active={mode === "price"}
              onClick={() => setMode("price")}
            >
              Price
            </MetricChip>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[14px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
              TVL (latest)
            </div>
            <div className="mt-2 font-serif text-[22px] text-black dark:text-[#f2f4f6]">
              {tvlLast != null ? formatUsd(tvlLast) : "N/A"}
            </div>
            <div className="mt-1 text-[12px] text-black/55 dark:text-white/55">
              90d:{" "}
              {tvlPct != null
                ? `${tvlPct >= 0 ? "+" : ""}${tvlPct.toFixed(1)}%`
                : "N/A"}
            </div>
          </div>

          <div className="rounded-[14px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
              Price (latest)
            </div>
            <div className="mt-2 font-serif text-[22px] text-black dark:text-[#f2f4f6]">
              {priceLast != null ? `$${formatNumber(priceLast)}` : "N/A"}
            </div>
            <div className="mt-1 text-[12px] text-black/55 dark:text-white/55">
              30d:{" "}
              {pricePct != null
                ? `${pricePct >= 0 ? "+" : ""}${pricePct.toFixed(1)}%`
                : "N/A"}
            </div>
          </div>

          <div className="rounded-[14px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
            <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
              Series
            </div>
            <div className="mt-2 text-[13px] text-black/65 dark:text-white/65">
              {mode === "tvl" ? "Total value locked" : "Spot price (USD)"}
            </div>
            <div className="mt-2 text-[12px] text-black/55 dark:text-white/55">
              Points: {activeSeries.length}
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="overflow-hidden rounded-[14px] border border-black/10 bg-[#f5f5f5] dark:border-white/10 dark:bg-[#0f1318]">
              <Skeleton className="h-[170px] w-full rounded-none md:h-[220px]" />
            </div>
          ) : data?.error ? (
            <div className="rounded-[14px] border border-black/10 bg-white p-4 text-[13px] text-red-600 dark:border-white/10 dark:bg-[#151a21] dark:text-red-400">
              {data.error}
            </div>
          ) : activeSeries.length ? (
            <Chart series={activeSeries} mode={mode} />
          ) : (
            <div className="rounded-[14px] border border-black/10 bg-white p-4 text-[13px] text-black/60 dark:border-white/10 dark:bg-[#151a21] dark:text-white/60">
              No {mode} data available for this project.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

