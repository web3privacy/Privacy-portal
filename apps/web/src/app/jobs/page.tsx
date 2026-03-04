import { JobsList } from "@/components/jobs/jobs-list";
import { loadJobsData } from "@/lib/jobs";

export const metadata = {
  title: "Jobs | Privacy Portal",
  description: "Privacy and Web3 job opportunities.",
};

// Avoid prerender issues with data loading
export const dynamic = "force-dynamic";

export default function JobsPage() {
  const data = loadJobsData();
  return <JobsList jobs={data.jobs} categories={data.categories} />;
}
