import { StacksPageContent } from "@/components/stacks/stacks-page-content";
import { siteConfig } from "@/lib/config";
import { loadAppData } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Stacks - ${siteConfig.name}`,
};

export const dynamic = "force-dynamic";

export default function StacksPage() {
  const data = loadAppData();
  const stacks = Object.values(data.stacks);

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      
      <StacksPageContent
        stacks={stacks}
        tools={data.tools}
        popularTools={data.popularTools}
        likeCounts={data.likeCounts}
      />
    </main>
  );
}
