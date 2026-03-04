"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsAdminFeaturedProjects } from "./NewsAdminFeaturedProjects";
import { NewsAdminList } from "./NewsAdminList";
import { NewsAdminAggregatedFeed } from "./NewsAdminAggregatedFeed";
import type { Article } from "@/types/news";

type Props = {
  featuredProjectIds: string[];
  articles: Article[];
};

export function NewsAdminTabs({ featuredProjectIds, articles }: Props) {
  return (
    <Tabs defaultValue="articles" className="mt-6">
      <TabsList>
        <TabsTrigger value="articles">Articles</TabsTrigger>
        <TabsTrigger value="featured">Featured projects</TabsTrigger>
        <TabsTrigger value="aggregated">Aggregated feed</TabsTrigger>
      </TabsList>

      <TabsContent value="articles">
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <Link
              href="/news/admin/new"
              className="rounded bg-[#22c55e] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#22c55e]/90"
            >
              New article
            </Link>
          </div>
          <NewsAdminList articles={articles} />
        </div>
      </TabsContent>

      <TabsContent value="featured">
        <div className="mt-6">
          <NewsAdminFeaturedProjects featuredProjectIds={featuredProjectIds} />
        </div>
      </TabsContent>

      <TabsContent value="aggregated">
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/75 dark:text-white/75">
            Aggregated feed
          </h2>
          <NewsAdminAggregatedFeed />
        </div>
      </TabsContent>
    </Tabs>
  );
}
