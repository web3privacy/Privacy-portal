import { JobsAdminList } from "@/components/jobs/jobs-admin-list";
import { loadJobsData } from "@/lib/jobs";
import Link from "next/link";

export const metadata = {
  title: "Jobs Admin | Privacy Portal",
};

export default function JobsAdminPage() {
  const data = loadJobsData();
  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Jobs Admin</h1>
        <Link href="/jobs" className="text-sm underline">← Back to Jobs</Link>
      </div>
      <JobsAdminList jobs={data.jobs} />
    </div>
  );
}
