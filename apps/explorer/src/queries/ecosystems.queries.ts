import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { Ecosystem } from "@/types/ecosystem";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";

export async function getEcosystems(): Promise<Ecosystem[]> {
  const data =
    (await loadExplorerDataFromDisk().catch(() => null)) ??
    (await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA, {
      next: { revalidate: 300 },
    }).then((r) => r.json()));

  return data?.[API_RESPONSE_KEYS.ECOSYSTEMS] || [];
}
