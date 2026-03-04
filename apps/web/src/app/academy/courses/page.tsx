import { CoursesPageContent } from "@/components/academy/courses-page-content";
import { loadAcademyData, fetchCourses } from "@/lib/academy";

export const metadata = {
  title: "Courses | Privacy Academy",
  description: "Privacy courses and lectures from academy.web3privacy.info",
};

// Fetch at request time (API not available during static build)
export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const data = loadAcademyData();
  const externalCourses = await fetchCourses();
  const allCourses = [...externalCourses, ...data.courses];

  return <CoursesPageContent courses={allCourses} />;
}
