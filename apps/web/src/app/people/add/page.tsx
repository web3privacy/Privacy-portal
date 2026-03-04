import Link from "next/link";

export const metadata = {
  title: "Add Person | Privacy Portal",
  description: "Add a new person to the People database",
};

export default function AddPersonPage() {
  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        <Link
          href="/people"
          className="mb-6 inline-flex items-center gap-2 text-[14px] text-black/70 hover:text-black dark:text-[#a8b0bd] dark:hover:text-white"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_back</span>
          Back to People
        </Link>
        
        <h1 className="mb-6 text-[32px] font-bold text-black dark:text-[#f2f4f6]">
          Add Person
        </h1>
        
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
          <p className="text-[14px] text-black/70 dark:text-[#a8b0bd]">
            Form for adding a new person will be implemented here. Currently, edit <code className="rounded bg-[#f0f0f0] px-1 py-0.5 dark:bg-[#1a1f27]">data/people.yaml</code> or <code className="rounded bg-[#f0f0f0] px-1 py-0.5 dark:bg-[#1a1f27]">data/people-user.yaml</code>
          </p>
        </div>
      </div>
    </main>
  );
}
