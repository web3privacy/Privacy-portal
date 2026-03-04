import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { Rank } from "@/types/rank";

export async function getRanks(): Promise<Rank[]> {
  const res = await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA);
  const data = await res.json();
  return data[API_RESPONSE_KEYS.RANKS] || [];
}
