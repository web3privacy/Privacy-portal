import { AcademyAdminEnhanced } from "@/components/academy/academy-admin-enhanced";
import { loadAcademyData } from "@/lib/academy";
import Link from "next/link";

export const metadata = {
  title: "Academy Admin | Privacy Portal",
};

export default function AcademyAdminPage() {
  const data = loadAcademyData();
  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold">Academy Admin</h1>
        <Link href="/academy" className="text-sm underline">← Back to Academy</Link>
      </div>
      <AcademyAdminEnhanced data={data} />
    </div>
  );
}
