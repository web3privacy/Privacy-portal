import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type SeriesPoint = { t: number; v: number };

type HeroMetricsResponse = {
  name?: string;
  slug?: string;
  geckoId?: string | null;
  tvl?: SeriesPoint[];
  price?: SeriesPoint[];
  error?: string;
};

function asNumber(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function takeLast<T>(arr: T[] | undefined, n: number): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.length > n ? arr.slice(arr.length - n) : arr;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug")?.trim() || null;
  const geckoIdParam = searchParams.get("geckoId")?.trim() || null;

  if (!slug && !geckoIdParam) {
    return NextResponse.json(
      { error: "Missing `slug` or `geckoId` query param" },
      { status: 400 }
    );
  }

  try {
    let name: string | undefined;
    let geckoId: string | null = geckoIdParam;
    let tvl: SeriesPoint[] | undefined;

    if (slug) {
      const proto = await fetch(`https://api.llama.fi/protocol/${slug}`, {
        next: { revalidate: 300 },
      }).then((r) => r.json());

      name = typeof proto?.name === "string" ? proto.name : undefined;
      geckoId =
        geckoId ??
        (typeof proto?.gecko_id === "string" && proto.gecko_id
          ? proto.gecko_id
          : null);

      // Prefer the top-level `tvl` series (aggregated across chains).
      const raw = takeLast(
        Array.isArray(proto?.tvl) ? (proto.tvl as unknown[]) : [],
        90
      );
      const series: SeriesPoint[] = [];
      for (const p of raw) {
        const obj = p as { date?: unknown; totalLiquidityUSD?: unknown };
        const dateSec = asNumber(obj?.date);
        const v = asNumber(obj?.totalLiquidityUSD);
        if (dateSec == null || v == null) continue;
        // `date` is unix seconds.
        series.push({ t: dateSec * 1000, v });
      }
      if (series.length) tvl = series;
    }

    let price: SeriesPoint[] | undefined;
    if (geckoId) {
      // CoinGecko free endpoint (no key). Keep payload small (30d daily).
      const cg = await fetch(
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(
          geckoId
        )}/market_chart?vs_currency=usd&days=30&interval=daily`,
        { next: { revalidate: 300 } }
      ).then((r) => r.json());

      const raw = Array.isArray(cg?.prices) ? cg.prices : [];
      const series: SeriesPoint[] = [];
      for (const pair of raw) {
        const t = Array.isArray(pair) ? asNumber(pair[0]) : null;
        const v = Array.isArray(pair) ? asNumber(pair[1]) : null;
        if (t == null || v == null) continue;
        series.push({ t, v });
      }
      if (series.length) price = series;
    }

    const body: HeroMetricsResponse = {
      name,
      slug: slug ?? undefined,
      geckoId,
      tvl,
      price,
    };

    return NextResponse.json(body);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load metrics";
    return NextResponse.json({ error: msg } satisfies HeroMetricsResponse, {
      status: 500,
    });
  }
}
