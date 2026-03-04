"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Job } from "@/types/jobs";

type Props = { jobs: Job[] };

export function JobsAdminList({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs);

  const refresh = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data.jobs ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <ul className="space-y-2">
      {jobs.map((job) => (
        <li key={job.id} className="flex items-center justify-between py-2 border-b">
          <span className="font-medium truncate">{job.title}</span>
          <div className="flex gap-2 flex-shrink-0">
            <Link href={`/jobs/edit/${job.id}`} className="text-sm underline">
              Edit
            </Link>
            <button onClick={() => handleDelete(job.id)} className="text-sm text-red-600 underline">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
