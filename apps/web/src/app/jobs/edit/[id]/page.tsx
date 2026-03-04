import { getJobById } from "@/lib/jobs";
import { EditJobForm } from "@/components/jobs/edit-job-form";
import Link from "next/link";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return <div>Job not found</div>;
  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 max-w-2xl">
      <Link href="/jobs/admin" className="text-sm underline mb-4 block">← Admin</Link>
      <h1 className="font-serif text-2xl font-bold mb-6">Edit Job</h1>
      <EditJobForm job={job} />
    </div>
  );
}
