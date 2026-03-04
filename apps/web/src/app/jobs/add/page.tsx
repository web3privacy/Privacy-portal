import { AddJobForm } from "@/components/jobs/add-job-form";

export const metadata = {
  title: "Add Job | Privacy Portal",
  description: "Add a job listing to the Privacy Portal.",
};

export default function AddJobPage() {
  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold mb-6">Add Job Listing</h1>
      <AddJobForm />
    </div>
  );
}
